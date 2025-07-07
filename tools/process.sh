#!/usr/bin/env bash
#
# Combined Image Processing Script for Blog
# Renames files using name.sh logic and optimizes them using optimize.sh
#
# Usage: ./process.sh <day> [filename] [optimize_options]
#
# Single file mode:
#   ./process.sh 15 image.jpg                    # Rename and optimize single file
#   ./process.sh 15 image.jpg -q 90              # Rename and optimize with quality 90
#   ./process.sh 15 image.jpg -s 800x600         # Rename, resize and optimize
#
# Batch mode (process all images in current directory):
#   ./process.sh 15                              # Rename and optimize all images
#   ./process.sh 15 -q 85                        # Rename and optimize all with quality 85
#   ./process.sh 15 -f webp                      # Rename and convert all to WebP
#
# Optimize options (same as optimize.sh):
#   -q, --quality <number>    Quality for JPEG (1-100, default: 75)
#   -s, --size <width>x<height>  Resize image (e.g., 800x600)
#   -f, --format <format>     Output format (jpg, png, webp, default: auto)
#   -o, --output <file>       Output filename (default: replaces input file)
#   -b, --backup              Create backup of original file
#   -v, --verbose             Verbose output
#   -h, --help                Show this help message

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_verbose() {
    if [ "$VERBOSE" = true ]; then
        echo -e "${BLUE}[VERBOSE]${NC} $1"
    fi
}

# Function to show help
show_help() {
    cat << EOF
Combined Image Processing Script for Blog

This script combines the functionality of name.sh and optimize.sh to rename and optimize images.

Usage: $0 <day> [filename] [optimize_options]

Single file mode:
    $0 15 image.jpg                    # Rename and optimize single file
    $0 15 image.jpg -q 90              # Rename and optimize with quality 90
    $0 15 image.jpg -s 800x600         # Rename, resize and optimize

Batch mode (process all images in current directory):
    $0 15                              # Rename and optimize all images
    $0 15 -q 85                        # Rename and optimize all with quality 85
    $0 15 -f webp                      # Rename and convert all to WebP

Arguments:
    day                 Day of the month (1-31) for filename prefix
    filename            (Optional) Specific file to process. If omitted, processes all images

Optimize options (same as optimize.sh):
    -q, --quality <number>    Quality for JPEG (1-100, default: 75)
    -s, --size <width>x<height>  Resize image (e.g., 800x600)
    -f, --format <format>     Output format (jpg, png, webp, default: auto)
    -o, --output <file>       Output filename (default: replaces input file)
    -b, --backup              Create backup of original file
    -v, --verbose             Verbose output
    -h, --help                Show this help message

Examples:
    $0 15 photo.jpg                    # Rename photo.jpg and optimize it
    $0 15 photo.jpg -q 90 -s 1200x800  # Rename, resize to 1200x800, optimize with quality 90
    $0 15 -f webp                      # Rename all images and convert to WebP
    $0 15 -q 80 -v                     # Rename and optimize all images with quality 80, verbose output

Supported image formats: JPG, JPEG, PNG, GIF, WebP
EOF
}

# Function to validate day input
validate_day() {
    local day="$1"
    if ! [[ "$day" =~ ^[1-9]$|^[12][0-9]$|^3[01]$ ]]; then
        print_error "Day must be a number between 1 and 31"
        exit 1
    fi
}

# Function to generate new filename (from name.sh logic)
generate_new_filename() {
    local day="$1"
    local original_filename="$2"
    
    # Format day as DD (with leading zero if needed)
    local formatted_day=$(printf "%02d" $day)
    
    # Get current time in HHMMSS format
    local current_time=$(date +"%H%M%S")
    
    # Extract file extension
    local file_extension="${original_filename##*.}"
    
    # Extract filename without extension
    local filename_without_ext="${original_filename%.*}"
    
    # Generate random string (4 characters)
    local random_chars=$(openssl rand -hex 2 | tr '[:upper:]' '[:lower:]' | cut -c1-4)
    
    # Take first 3 characters of original filename (or less if shorter)
    local filename_part
    if [ ${#filename_without_ext} -ge 3 ]; then
        filename_part="${filename_without_ext:0:3}"
    else
        filename_part="$filename_without_ext"
    fi
    
    # Take last 3 characters of original filename (or less if shorter)
    local filename_part_end
    if [ ${#filename_without_ext} -ge 3 ]; then
        filename_part_end="${filename_without_ext: -3}"
    else
        filename_part_end="$filename_without_ext"
    fi
    
    # Generate random 2-digit number
    local random_number=$(printf "%02d" $((RANDOM % 100)))
    
    # Combine filename parts and convert to lowercase, remove underscores
    local filename_combined="${random_chars}${filename_part}${filename_part_end}${random_number}"
    filename_combined=$(echo "$filename_combined" | tr '[:upper:]' '[:lower:]' | tr -d '_')
    
    # Combine all parts: DD_HHMMSS_randomOriginalName.ext
    echo "${formatted_day}_${current_time}_${filename_combined}.${file_extension}"
}

# Function to check if file is an image
is_image_file() {
    local file="$1"
    local ext=$(echo "${file##*.}" | tr '[:upper:]' '[:lower:]')
    case "$ext" in
        jpg|jpeg|png|gif|webp|bmp|tiff|tif) return 0 ;;
        *) return 1 ;;
    esac
}



# Function to process a single file
process_single_file() {
    local day="$1"
    local original_filename="$2"
    shift 2
    local optimize_args=("$@")
    
    # Remove leading "./" if present
    original_filename="${original_filename#./}"
    
    print_status "Processing: $original_filename"
    
    # Check if file exists
    if [ ! -f "$original_filename" ]; then
        print_error "File not found: $original_filename"
        return 1
    fi
    
    # Check if it's an image file
    if ! is_image_file "$original_filename"; then
        print_warning "Skipping non-image file: $original_filename"
        return 0
    fi
    
    # Generate new filename
    local new_filename=$(generate_new_filename "$day" "$original_filename")
    print_verbose "Generated new filename: $new_filename"
    
    # Rename the file
    mv "$original_filename" "$new_filename"
    print_status "Renamed: $original_filename -> $new_filename"
    
    # Optimize the renamed file
    print_verbose "Running optimize.sh on: $new_filename"
    if [ ${#optimize_args[@]} -gt 0 ]; then
        print_verbose "Optimize arguments: ${optimize_args[*]}"
        ./optimize.sh "${optimize_args[@]}" "$new_filename"
    else
        ./optimize.sh "$new_filename"
    fi
    
    print_status "Completed processing: $original_filename"
}

# Function to process all images in batch mode
process_batch() {
    local day="$1"
    shift
    local optimize_args=("$@")
    
    # Use mapfile to properly handle filenames with spaces
    local image_files=()
    while IFS= read -r -d '' file; do
        if [ -f "$file" ] && is_image_file "$file"; then
            image_files+=("$file")
        fi
    done < <(find . -maxdepth 1 -type f -print0)
    
    if [ ${#image_files[@]} -eq 0 ]; then
        print_warning "No image files found in current directory"
        return 0
    fi
    
    print_status "Found ${#image_files[@]} image file(s) for batch processing"
    print_verbose "Image files: ${image_files[*]}"
    
    local processed_count=0
    local error_count=0
    
    for file in "${image_files[@]}"; do
        if process_single_file "$day" "$file" "${optimize_args[@]}"; then
            ((processed_count++))
        else
            ((error_count++))
        fi
    done
    
    print_status "Batch processing completed: $processed_count successful, $error_count errors"
}

# Parse command line arguments
DAY=""
FILENAME=""
OPTIMIZE_ARGS=()
VERBOSE=false

# Check if help is requested
if [[ "$1" == "-h" || "$1" == "--help" ]]; then
    show_help
    exit 0
fi

# Check if at least day is provided
if [ $# -lt 1 ]; then
    print_error "Day parameter is required"
    show_help
    exit 1
fi

# Get day parameter
DAY="$1"
shift

# Validate day
validate_day "$DAY"

# Parse remaining arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -q|--quality|-s|--size|-f|--format|-o|--output)
            # These are optimize arguments
            OPTIMIZE_ARGS+=("$1" "$2")
            shift 2
            ;;
        -b|--backup|-v|--verbose)
            # These are optimize arguments
            OPTIMIZE_ARGS+=("$1")
            if [[ "$1" == "-v" || "$1" == "--verbose" ]]; then
                VERBOSE=true
            fi
            shift
            ;;
        -*)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
        *)
            # This is the filename (if provided) - collect all remaining arguments as filename
            if [ -z "$FILENAME" ]; then
                FILENAME="$*"
                break
            else
                print_error "Multiple filenames specified. Only one file allowed in single file mode."
                exit 1
            fi
            ;;
    esac
done

# Check if optimize.sh exists
if [ ! -f "./optimize.sh" ]; then
    print_error "optimize.sh not found in current directory"
    exit 1
fi

# Make optimize.sh executable
chmod +x ./optimize.sh

print_status "Starting image processing for day: $DAY"

# Process based on whether filename was provided
if [ -n "$FILENAME" ]; then
    # Single file mode
    print_status "Single file mode: $FILENAME"
    process_single_file "$DAY" "$FILENAME" "${OPTIMIZE_ARGS[@]}"
else
    # Batch mode
    print_status "Batch mode: processing all images in current directory"
    process_batch "$DAY" "${OPTIMIZE_ARGS[@]}"
fi

print_status "Image processing completed successfully!" 