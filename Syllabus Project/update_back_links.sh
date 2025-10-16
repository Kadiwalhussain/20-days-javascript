#!/bin/zsh

# Directory containing the syllabus files
DIR="/Users/muhammadhussainkadiwal/Downloads/project/Syllabus Project"

# Files to update
FILES=("adbms_syllabus.html" "cn_syllabus.html" "dwm_syllabus.html" "ip_syllabus.html" "pgm_syllabus.html" "se_syllabus.html" "tcs_syllabus.html" "exam_schedule_web.html")

# Update the back links in each file
for file in "${FILES[@]}"; do
    if [[ -f "$DIR/$file" ]]; then
        # Replace the back link with the new consistent one
        sed -i '' 's|<a href="index.html".*>.*Back.*</a>|<a href="index.html" class="back-link">← Back to Courses</a>|g' "$DIR/$file"
        echo "Updated back link in $file"
    fi
done

echo "All files have been updated"