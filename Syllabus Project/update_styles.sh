#!/bin/zsh
# Update the style and structure of all syllabus files

# Get the directory of the script
DIR="/Users/muhammadhussainkadiwal/Downloads/project/Syllabus Project"

# List of all syllabus files
FILES=("adbms_syllabus.html" "cn_syllabus.html" "dwm_syllabus.html" "exam_schedule_web.html" "ip_syllabus.html" "pgm_syllabus.html" "se_syllabus.html" "tcs_syllabus.html")

# Common header content
HEADER='<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Course Syllabus</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary-color: #2563eb;
            --bg-color: #f8fafc;
            --text-color: #1e293b;
            --border-color: #e2e8f0;
            --hover-color: #3b82f6;
        }
        
        body {
            font-family: "Inter", system-ui, -apple-system, sans-serif;
            margin: 0;
            padding: 2rem;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        h1 {
            color: var(--primary-color);
            font-size: 2.25rem;
            margin-bottom: 2rem;
            font-weight: 700;
            text-align: center;
        }

        .controls {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        button {
            background-color: var(--primary-color);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.5rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s ease;
        }

        button:hover {
            background-color: var(--hover-color);
        }

        .module {
            background: #f8fafc;
            border-radius: 0.75rem;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            border: 1px solid var(--border-color);
        }

        .module h3 {
            color: var(--primary-color);
            margin-top: 0;
            font-size: 1.25rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .module h3 span {
            font-size: 0.875rem;
            background: var(--primary-color);
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
        }

        ul {
            list-style: none;
            padding: 0;
            margin: 1rem 0 0 0;
        }

        li {
            background: white;
            padding: 1rem;
            border-radius: 0.5rem;
            margin-bottom: 0.75rem;
            border: 1px solid var(--border-color);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        li:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        label {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
            cursor: pointer;
        }

        input[type="checkbox"] {
            width: 1.25rem;
            height: 1.25rem;
            margin-top: 0.25rem;
            cursor: pointer;
            accent-color: var(--primary-color);
        }

        .topic-content {
            flex: 1;
        }

        .topic-title {
            font-weight: 600;
            margin-bottom: 0.25rem;
        }

        .topic-description {
            color: #64748b;
            font-size: 0.925rem;
        }

        .back-link {
            display: inline-block;
            margin-top: 2rem;
            color: var(--primary-color);
            text-decoration: none;
            font-weight: 500;
            transition: color 0.2s ease;
        }

        .back-link:hover {
            color: var(--hover-color);
        }

        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }

            .container {
                padding: 1.5rem;
            }

            h1 {
                font-size: 1.75rem;
            }

            .controls {
                flex-direction: column;
            }

            button {
                width: 100%;
            }
        }

        /* For exam schedule */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 2rem 0;
            background: white;
            border-radius: 0.5rem;
            overflow: hidden;
        }

        th, td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        th {
            background: var(--primary-color);
            color: white;
            font-weight: 600;
        }

        tr:hover {
            background: #f1f5f9;
        }

        tr:last-child td {
            border-bottom: none;
        }
    </style>
</head>
'

# Loop through each file and update it
for file in "${FILES[@]}"; do
    if [[ -f "$DIR/$file" ]]; then
        # Create backup
        cp "$DIR/$file" "$DIR/$file.bak"
        
        # Extract content between <body> tags
        BODY=$(sed -n '/<body/,/<\/body>/p' "$DIR/$file")
        
        # Create new file with updated structure
        echo "$HEADER" > "$DIR/$file"
        echo "$BODY" >> "$DIR/$file"
        echo "</html>" >> "$DIR/$file"
        
        echo "Updated $file with new styling"
    fi
done

echo "All files have been updated with the new UI"