const { Chess } = require('chess.js');
const Game = require('./models/Game');
const User = require('./models/User');
const { logger } = require('./utils/logger');

// Store active game rooms and player connections
const activeGames = new Map();
const playerSockets = new Map();

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    // Handle player authentication
    socket.on('authenticate', async ({ userId }) => {
      try {
        const user = await User.findById(userId);
        if (user) {
          playerSockets.set(userId, socket.id);
          user.isOnline = true;
          await user.save();
          socket.userId = userId;
          io.emit('user_status_change', { userId, isOnline: true });
        }
      } catch (error) {
        logger.error('Authentication error:', error);
      }
    });

    // Handle game creation
    socket.on('create_game', async ({ opponentId, timeControl }) => {
      try {
        const creator = await User.findById(socket.userId);
        const opponent = await User.findById(opponentId);

        if (!creator || !opponent) {
          socket.emit('game_error', { message: 'Invalid players' });
          return;
        }

        const game = new Game({
          whitePlayer: Math.random() < 0.5 ? creator._id : opponent._id,
          blackPlayer: Math.random() < 0.5 ? creator._id : opponent._id,
          timeControl,
          roomId: `game_${Date.now()}`,
          startTime: new Date(),
          whiteTimeRemaining: timeControl.initial,
          blackTimeRemaining: timeControl.initial,
          lastMoveTime: new Date()
        });

        await game.save();
        
        activeGames.set(game.roomId, {
          gameId: game._id,
          chess: new Chess(),
          whiteSocketId: playerSockets.get(game.whitePlayer.toString()),
          blackSocketId: playerSockets.get(game.blackPlayer.toString())
        });

        // Notify players
        io.to(playerSockets.get(creator._id.toString()))
          .to(playerSockets.get(opponent._id.toString()))
          .emit('game_created', {
            gameId: game._id,
            roomId: game.roomId,
            whitePlayer: game.whitePlayer,
            blackPlayer: game.blackPlayer
          });

      } catch (error) {
        logger.error('Game creation error:', error);
        socket.emit('game_error', { message: 'Failed to create game' });
      }
    });

    // Handle joining a game
    socket.on('join_game', async ({ roomId }) => {
      try {
        const game = await Game.findOne({ roomId }).populate('whitePlayer blackPlayer');
        if (!game) {
          socket.emit('game_error', { message: 'Game not found' });
          return;
        }

        socket.join(roomId);
        socket.emit('game_state', {
          fen: game.fen,
          pgn: game.pgn,
          whiteTime: game.whiteTimeRemaining,
          blackTime: game.blackTimeRemaining,
          status: game.status
        });

      } catch (error) {
        logger.error('Join game error:', error);
        socket.emit('game_error', { message: 'Failed to join game' });
      }
    });

    // Handle moves
    socket.on('make_move', async ({ roomId, move }) => {
      try {
        const activeGame = activeGames.get(roomId);
        if (!activeGame) {
          socket.emit('game_error', { message: 'Game not found' });
          return;
        }

        const game = await Game.findById(activeGame.gameId);
        if (!game) {
          socket.emit('game_error', { message: 'Game not found in database' });
          return;
        }

        // Verify it's the player's turn
        const isWhite = game.whitePlayer.toString() === socket.userId;
        const isBlack = game.blackPlayer.toString() === socket.userId;
        const chess = new Chess(game.fen);
        
        if ((chess.turn() === 'w' && !isWhite) || (chess.turn() === 'b' && !isBlack)) {
          socket.emit('game_error', { message: 'Not your turn' });
          return;
        }

        // Make the move
        if (game.makeMove(move)) {
          // Update time
          game.updateTime(chess.turn() === 'w' ? 'black' : 'white');
          await game.save();

          // Broadcast the move to both players
          io.to(roomId).emit('move_made', {
            move,
            fen: game.fen,
            pgn: game.pgn,
            whiteTime: game.whiteTimeRemaining,
            blackTime: game.blackTimeRemaining
          });

          // Check if game is over
          if (game.status === 'completed') {
            io.to(roomId).emit('game_over', {
              result: game.result,
              winner: game.winner
            });

            // Update player ratings
            if (game.winner) {
              const winner = await User.findById(game.winner);
              const loser = await User.findById(
                game.winner.equals(game.whitePlayer) ? game.blackPlayer : game.whitePlayer
              );

              await winner.updateRating('win', loser.rating);
              await loser.updateRating('loss', winner.rating);
            } else {
              // Draw
              const white = await User.findById(game.whitePlayer);
              const black = await User.findById(game.blackPlayer);
              
              await white.updateRating('draw', black.rating);
              await black.updateRating('draw', white.rating);
            }

            activeGames.delete(roomId);
          }
        } else {
          socket.emit('game_error', { message: 'Invalid move' });
        }

      } catch (error) {
        logger.error('Move error:', error);
        socket.emit('game_error', { message: 'Failed to make move' });
      }
    });

    // Handle draw offers
    socket.on('offer_draw', async ({ roomId }) => {
      try {
        const game = await Game.findOne({ roomId });
        if (!game) {
          socket.emit('game_error', { message: 'Game not found' });
          return;
        }

        game.drawOffers.push({ by: socket.userId });
        await game.save();

        io.to(roomId).emit('draw_offered', { by: socket.userId });
      } catch (error) {
        logger.error('Draw offer error:', error);
        socket.emit('game_error', { message: 'Failed to offer draw' });
      }
    });

    // Handle draw responses
    socket.on('respond_to_draw', async ({ roomId, accept }) => {
      try {
        const game = await Game.findOne({ roomId });
        if (!game) {
          socket.emit('game_error', { message: 'Game not found' });
          return;
        }

        if (accept) {
          game.status = 'completed';
          game.result = '1/2-1/2';
          await game.save();

          // Update ratings
          const white = await User.findById(game.whitePlayer);
          const black = await User.findById(game.blackPlayer);
          
          await white.updateRating('draw', black.rating);
          await black.updateRating('draw', white.rating);

          io.to(roomId).emit('game_over', {
            result: '1/2-1/2',
            winner: null
          });

          activeGames.delete(roomId);
        } else {
          io.to(roomId).emit('draw_declined', { by: socket.userId });
        }
      } catch (error) {
        logger.error('Draw response error:', error);
        socket.emit('game_error', { message: 'Failed to respond to draw' });
      }
    });

    // Handle resignation
    socket.on('resign', async ({ roomId }) => {
      try {
        const game = await Game.findOne({ roomId });
        if (!game) {
          socket.emit('game_error', { message: 'Game not found' });
          return;
        }

        game.status = 'completed';
        game.result = socket.userId === game.whitePlayer.toString() ? '0-1' : '1-0';
        game.winner = socket.userId === game.whitePlayer.toString() ? game.blackPlayer : game.whitePlayer;
        await game.save();

        // Update ratings
        const winner = await User.findById(game.winner);
        const loser = await User.findById(
          game.winner.equals(game.whitePlayer) ? game.blackPlayer : game.whitePlayer
        );

        await winner.updateRating('win', loser.rating);
        await loser.updateRating('loss', winner.rating);

        io.to(roomId).emit('game_over', {
          result: game.result,
          winner: game.winner,
          resigned: true
        });

        activeGames.delete(roomId);
      } catch (error) {
        logger.error('Resignation error:', error);
        socket.emit('game_error', { message: 'Failed to resign' });
      }
    });

    // Handle chat messages
    socket.on('chat_message', async ({ roomId, message }) => {
      try {
        const game = await Game.findOne({ roomId });
        if (!game) {
          socket.emit('game_error', { message: 'Game not found' });
          return;
        }

        game.chat.push({
          user: socket.userId,
          message
        });
        await game.save();

        io.to(roomId).emit('chat_message', {
          userId: socket.userId,
          message,
          timestamp: new Date()
        });
      } catch (error) {
        logger.error('Chat message error:', error);
        socket.emit('game_error', { message: 'Failed to send message' });
      }
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      try {
        if (socket.userId) {
          const user = await User.findById(socket.userId);
          if (user) {
            user.isOnline = false;
            await user.save();
            io.emit('user_status_change', { userId: socket.userId, isOnline: false });
          }
          playerSockets.delete(socket.userId);
        }
        logger.info(`Client disconnected: ${socket.id}`);
      } catch (error) {
        logger.error('Disconnect error:', error);
      }
    });
  });
};

module.exports = { setupSocket }; 