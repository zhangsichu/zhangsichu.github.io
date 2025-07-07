#!/usr/bin/env bash
#
# Image Optimization Script for Blog
# Optimizes and compresses images for web use
#
# Usage: ./optimize.sh [options] <input_file>
#
# Options:
#   -q, --quality <number>    Quality for JPEG (1-100, default: 75)
#   -s, --size <width>x<height>  Resize image (e.g., 800x600)
#   -f, --format <format>     Output format (jpg, png, webp, default: auto)
#   -o, --output <file>       Output filename (default: replaces input file)
#   -b, --backup              Create backup of original file
#   -v, --verbose             Verbose output
#   -h, --help                Show this help message

set -e

# Default values
QUALITY=75
RESIZE=""
OUTPUT_FORMAT=""
OUTPUT_FILE=""
CREATE_BACKUP=false
VERBOSE=false
INPUT_FILE=""

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
Image Optimization Script for Blog

Usage: $0 [options] <input_file>

Options:
    -q, --quality <number>    Quality for JPEG (1-100, default: 75)
    -s, --size <width>x<height>  Resize image (e.g., 800x600)
    -f, --format <format>     Output format (jpg, png, webp, default: auto)
    -o, --output <file>       Output filename (default: replaces input file)
    -b, --backup              Create backup of original file
    -v, --verbose             Verbose output
    -h, --help                Show this help message

Examples:
    $0 image.jpg                    # Replace image.jpg with optimized version
    $0 -q 90 image.jpg             # High quality JPEG (replaces original)
    $0 -s 800x600 image.jpg        # Resize and optimize (replaces original)
    $0 -f webp image.jpg           # Convert to WebP (creates image.webp)
    $0 -o optimized.jpg image.jpg  # Custom output name
    $0 -b image.jpg                # Keep original, create optimized version
    $0 -b -v image.jpg             # Backup original and verbose output

Supported formats: JPG, JPEG, PNG, GIF, WebP

Note: By default, the script replaces the input file with the optimized version.
Use --backup to preserve the original file.
EOF
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to get file extension
get_extension() {
    local filename="$1"
    echo "${filename##*.}" | tr '[:upper:]' '[:lower:]'
}

# Function to get filename without extension
get_filename_without_ext() {
    local filename="$1"
    echo "${filename%.*}"
}

# Function to get file size in human readable format
get_file_size() {
    local file="$1"
    if command_exists stat; then
        stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null
    else
        ls -l "$file" | awk '{print $5}'
    fi
}

# Function to format file size
format_size() {
    local size="$1"
    if [ "$size" -gt 1048576 ]; then
        echo "$(echo "scale=1; $size/1048576" | bc)MB"
    elif [ "$size" -gt 1024 ]; then
        echo "$(echo "scale=1; $size/1024" | bc)KB"
    else
        echo "${size}B"
    fi
}

# Function to check dependencies
check_dependencies() {
    local missing_deps=()
    
    if ! command_exists convert; then
        missing_deps+=("ImageMagick")
    fi
    
    if ! command_exists jpegoptim; then
        print_warning "jpegoptim not found. JPEG optimization will be limited."
    fi
    
    if ! command_exists optipng; then
        print_warning "optipng not found. PNG optimization will be limited."
    fi
    
    if ! command_exists gifsicle; then
        print_warning "gifsicle not found. GIF optimization will be limited."
    fi
    
    if ! command_exists cwebp; then
        print_warning "cwebp not found. WebP conversion will not be available."
    fi
    
    if [ ${#missing_deps[@]} -gt 0 ]; then
        print_error "Missing required dependencies: ${missing_deps[*]}"
        echo "Please install them:"
        echo "  macOS: brew install imagemagick jpegoptim optipng gifsicle webp"
        echo "  Ubuntu: sudo apt-get install imagemagick jpegoptim optipng gifsicle webp"
        exit 1
    fi
}

# Function to optimize JPEG
optimize_jpeg() {
    local input="$1"
    local output="$2"
    local quality="$3"
    
    print_verbose "Optimizing JPEG with quality: $quality"
    
    # Use ImageMagick for conversion and resizing
    local convert_cmd="convert '$input'"
    
    if [ -n "$RESIZE" ]; then
        convert_cmd="$convert_cmd -resize $RESIZE"
        print_verbose "Resizing to: $RESIZE"
    fi
    
    convert_cmd="$convert_cmd -quality $quality '$output'"
    
    print_verbose "Running: $convert_cmd"
    eval "$convert_cmd"
    
    # Further optimize with jpegoptim if available
    if command_exists jpegoptim; then
        print_verbose "Running jpegoptim for additional compression"
        jpegoptim --strip-all --max=75 "$output" >/dev/null 2>&1 || true
    fi
}

# Function to optimize PNG
optimize_png() {
    local input="$1"
    local output="$2"
    
    print_verbose "Optimizing PNG"
    
    # Use ImageMagick for conversion and resizing
    local convert_cmd="convert '$input'"
    
    if [ -n "$RESIZE" ]; then
        convert_cmd="$convert_cmd -resize $RESIZE"
        print_verbose "Resizing to: $RESIZE"
    fi
    
    convert_cmd="$convert_cmd '$output'"
    
    print_verbose "Running: $convert_cmd"
    eval "$convert_cmd"
    
    # Further optimize with optipng if available
    if command_exists optipng; then
        print_verbose "Running optipng for additional compression"
        optipng -o5 -strip all "$output" >/dev/null 2>&1 || true
    fi
}

# Function to optimize GIF
optimize_gif() {
    local input="$1"
    local output="$2"
    
    print_verbose "Optimizing GIF"
    
    # Use ImageMagick for conversion and resizing
    local convert_cmd="convert '$input'"
    
    if [ -n "$RESIZE" ]; then
        convert_cmd="$convert_cmd -resize $RESIZE"
        print_verbose "Resizing to: $RESIZE"
    fi
    
    convert_cmd="$convert_cmd '$output'"
    
    print_verbose "Running: $convert_cmd"
    eval "$convert_cmd"
    
    # Further optimize with gifsicle if available
    if command_exists gifsicle; then
        print_verbose "Running gifsicle for additional compression"
        gifsicle -O3 --lossy=80 "$output" -o "$output" >/dev/null 2>&1 || true
    fi
}

# Function to convert to WebP
convert_to_webp() {
    local input="$1"
    local output="$2"
    local quality="$3"
    
    print_verbose "Converting to WebP with quality: $quality"
    
    if ! command_exists cwebp; then
        print_error "cwebp not found. Cannot convert to WebP."
        return 1
    fi
    
    local cwebp_cmd="cwebp -q $quality"
    
    if [ -n "$RESIZE" ]; then
        cwebp_cmd="$cwebp_cmd -resize $RESIZE"
        print_verbose "Resizing to: $RESIZE"
    fi
    
    cwebp_cmd="$cwebp_cmd '$input' -o '$output'"
    
    print_verbose "Running: $cwebp_cmd"
    eval "$cwebp_cmd"
}

# Function to determine output format
determine_output_format() {
    local input="$1"
    local ext=$(get_extension "$input")
    
    if [ -n "$OUTPUT_FORMAT" ]; then
        echo "$OUTPUT_FORMAT"
    else
        case "$ext" in
            jpg|jpeg) echo "jpg" ;;
            png) echo "png" ;;
            gif) echo "gif" ;;
            *) echo "jpg" ;; # Default to jpg
        esac
    fi
}

# Function to generate output filename
generate_output_filename() {
    local input="$1"
    local output_format="$2"
    
    if [ -n "$OUTPUT_FILE" ]; then
        echo "$OUTPUT_FILE"
    else
        # Default behavior: replace input file with optimized version
        echo "$input"
    fi
}

# Function to optimize image
optimize_image() {
    local input="$1"
    local output_format="$2"
    local output="$3"
    
    local input_ext=$(get_extension "$input")
    
    # If output format is different from input format, we need to handle extension
    if [ "$output_format" != "$input_ext" ]; then
        local output_with_ext="${output%.*}.$output_format"
        output="$output_with_ext"
        print_verbose "Format conversion detected: $input_ext -> $output_format"
    fi
    
    case "$output_format" in
        jpg|jpeg)
            optimize_jpeg "$input" "$output" "$QUALITY"
            ;;
        png)
            optimize_png "$input" "$output"
            ;;
        gif)
            optimize_gif "$input" "$output"
            ;;
        webp)
            convert_to_webp "$input" "$output" "$QUALITY"
            ;;
        *)
            print_error "Unsupported output format: $output_format"
            exit 1
            ;;
    esac
}

# Function to show optimization results
show_results() {
    local input="$1"
    local output="$2"
    
    if [ -f "$output" ]; then
        local input_size=$(get_file_size "$input")
        local output_size=$(get_file_size "$output")
        local input_size_formatted=$(format_size "$input_size")
        local output_size_formatted=$(format_size "$output_size")
        
        local savings=$((input_size - output_size))
        local savings_percent=0
        
        if [ "$input_size" -gt 0 ]; then
            savings_percent=$(echo "scale=1; ($savings * 100) / $input_size" | bc)
        fi
        
        print_status "Optimization complete!"
        echo "  Input:  $input ($input_size_formatted)"
        echo "  Output: $output ($output_size_formatted)"
        echo "  Savings: ${savings_percent}% ($(format_size $savings))"
        
        if [ "$savings" -gt 0 ]; then
            print_status "File size reduced successfully!"
        else
            print_warning "No size reduction achieved. File might already be optimized."
        fi
    else
        print_error "Output file was not created!"
        exit 1
    fi
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -q|--quality)
            QUALITY="$2"
            shift 2
            ;;
        -s|--size)
            RESIZE="$2"
            shift 2
            ;;
        -f|--format)
            OUTPUT_FORMAT="$2"
            shift 2
            ;;
        -o|--output)
            OUTPUT_FILE="$2"
            shift 2
            ;;
        -b|--backup)
            CREATE_BACKUP=true
            shift
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        -*)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
        *)
            if [ -z "$INPUT_FILE" ]; then
                INPUT_FILE="$1"
            else
                print_error "Multiple input files specified. Only one file allowed."
                exit 1
            fi
            shift
            ;;
    esac
done

# Validate input
if [ -z "$INPUT_FILE" ]; then
    print_error "No input file specified."
    show_help
    exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
    print_error "Input file does not exist: $INPUT_FILE"
    exit 1
fi

# Validate quality
if ! [[ "$QUALITY" =~ ^[0-9]+$ ]] || [ "$QUALITY" -lt 1 ] || [ "$QUALITY" -gt 100 ]; then
    print_error "Quality must be a number between 1 and 100"
    exit 1
fi

# Validate resize format
if [ -n "$RESIZE" ] && ! [[ "$RESIZE" =~ ^[0-9]+x[0-9]+$ ]]; then
    print_error "Resize format must be WIDTHxHEIGHT (e.g., 800x600)"
    exit 1
fi

# Check dependencies
check_dependencies

# Get file information
INPUT_EXT=$(get_extension "$INPUT_FILE")
OUTPUT_FORMAT=$(determine_output_format "$INPUT_FILE")
OUTPUT_FILE=$(generate_output_filename "$INPUT_FILE" "$OUTPUT_FORMAT")

print_status "Starting image optimization..."
print_verbose "Input file: $INPUT_FILE ($INPUT_EXT)"
print_verbose "Output format: $OUTPUT_FORMAT"
print_verbose "Output file: $OUTPUT_FILE"
print_verbose "Quality: $QUALITY"
if [ -n "$RESIZE" ]; then
    print_verbose "Resize: $RESIZE"
fi

# Create backup if requested
if [ "$CREATE_BACKUP" = true ]; then
    BACKUP_FILE="${INPUT_FILE}.backup"
    cp "$INPUT_FILE" "$BACKUP_FILE"
    print_status "Backup created: $BACKUP_FILE"
fi

# If not creating backup and output is same as input, we need to work with a temp file
if [ "$CREATE_BACKUP" = false ] && [ "$OUTPUT_FILE" = "$INPUT_FILE" ]; then
    TEMP_OUTPUT="${INPUT_FILE}.tmp"
    OUTPUT_FILE="$TEMP_OUTPUT"
fi

# Optimize the image
optimize_image "$INPUT_FILE" "$OUTPUT_FORMAT" "$OUTPUT_FILE"

# If we used a temp file, replace the original
if [ -n "$TEMP_OUTPUT" ] && [ -f "$TEMP_OUTPUT" ]; then
    mv "$TEMP_OUTPUT" "$INPUT_FILE"
    OUTPUT_FILE="$INPUT_FILE"
    print_verbose "Replaced original file with optimized version"
fi

# Show results
show_results "$INPUT_FILE" "$OUTPUT_FILE"

print_status "Optimization completed successfully!" 