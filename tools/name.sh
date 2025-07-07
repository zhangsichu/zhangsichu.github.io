#!/bin/bash

# Script to generate attachment file names for blog posts
# Usage: ./name.sh <day> <original_filename>
# Example: ./name.sh 4 perMinuteAction.zip

# Check if correct number of arguments provided
if [ $# -ne 2 ]; then
    echo "Usage: $0 <day> <original_filename>"
    echo "Example: $0 4 perMinuteAction.zip"
    exit 1
fi

# Get input parameters
day=$1
original_filename=$2

# Validate day input (1-31)
if ! [[ "$day" =~ ^[1-9]$|^[12][0-9]$|^3[01]$ ]]; then
    echo "Error: Day must be a number between 1 and 31"
    exit 1
fi

# Check if original filename exists
if [ -z "$original_filename" ]; then
    echo "Error: Original filename cannot be empty"
    exit 1
fi

# Format day as DD (with leading zero if needed)
formatted_day=$(printf "%02d" $day)

# Get current time in HHMMSS format
current_time=$(date +"%H%M%S")

# Extract file extension
file_extension="${original_filename##*.}"

# Extract filename without extension
filename_without_ext="${original_filename%.*}"

# Generate random string (4 characters)
random_chars=$(openssl rand -hex 2 | tr '[:upper:]' '[:lower:]' | cut -c1-4)

# Take first 3 characters of original filename (or less if shorter)
if [ ${#filename_without_ext} -ge 3 ]; then
    filename_part="${filename_without_ext:0:3}"
else
    filename_part="$filename_without_ext"
fi

# Take last 3 characters of original filename (or less if shorter)
if [ ${#filename_without_ext} -ge 3 ]; then
    filename_part_end="${filename_without_ext: -3}"
else
    filename_part_end="$filename_without_ext"
fi

# Generate random 2-digit number
random_number=$(printf "%02d" $((RANDOM % 100)))

# Combine all parts: DD_HHMMSS_randomOriginalName.ext
new_filename="${formatted_day}_${current_time}_${random_chars}${filename_part}${filename_part_end}${random_number}.${file_extension}"

echo "$new_filename" 