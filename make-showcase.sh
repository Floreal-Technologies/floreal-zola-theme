#!/usr/bin/env bash
set -euo pipefail

LEFT=floréal-mountains-screenshot.png
RIGHT=floréal-path-screenshot.png
OUT=floréal-showcase.png
# Value in pixels.
OFFSET=340
STROKE='#f2d5c4'
STROKE_WIDTH=3

usage() {
  cat <<USAGE
Usage: ${0##*/} [OPTION]...

  -l, --left FILE      image shown left of the slash     (default: $LEFT)
  -r, --right FILE     image shown right of the slash    (default: $RIGHT)
  -o, --output FILE    output file                       (default: $OUT)
  -x, --offset PX      slash offset from centre, in px   (default: $OFFSET)
  -c, --colour COLOUR  colour of the seam line           (default: $STROKE)
  -w, --width PX       thickness of the seam line, in px (default: $STROKE_WIDTH)
  -h, --help           show this help
USAGE
}

# This needs the enhanced getopt of util-linux. The BSD getopt that macOS ships
# knows no long options, and returns 4 for nothing.
getopt -T >/dev/null 2>&1 || (( $? == 4 )) || {
  echo "error: this script needs the enhanced getopt of gnu-getopt. You can install it with brew" >&2
  exit 3
}

PARSED=$(getopt \
  --name "${0##*/}" \
  --options 'l:r:o:x:c:w:h' \
  --longoptions 'left:,right:,output:,offset:,colour:,color:,width:,help' \
  -- "$@") || { usage >&2; exit 2; }
eval set -- "$PARSED"

while true; do
  case $1 in
    -l|--left)   LEFT=$2; shift 2 ;;
    -r|--right)  RIGHT=$2; shift 2 ;;
    -o|--output) OUT=$2; shift 2 ;;
    -x|--offset) OFFSET=$2; shift 2 ;;
    -c|--colour|--color) STROKE=$2; shift 2 ;;
    -w|--width)  STROKE_WIDTH=$2; shift 2 ;;
    -h|--help)   usage; exit 0 ;;
    --) shift; break ;;
  esac
done

if (( $# > 0 )); then
  echo "error: unexpected argument '$1'" >&2
  usage >&2
  exit 2
fi

for value in "$OFFSET" "$STROKE_WIDTH"; do
  if [[ ! $value =~ ^[0-9]+$ ]]; then
    echo "error: '$value' is not a whole number" >&2
    exit 2
  fi
done

read -r WIDTH HEIGHT < <(magick identify -format '%w %h\n' "$LEFT")
read -r RIGHT_WIDTH RIGHT_HEIGHT < <(magick identify -format '%w %h\n' "$RIGHT")

if [[ "$WIDTH $HEIGHT" != "$RIGHT_WIDTH $RIGHT_HEIGHT" ]]; then
  echo "error: images differ in size (${WIDTH}x${HEIGHT} vs ${RIGHT_WIDTH}x${RIGHT_HEIGHT})" >&2
  exit 1
fi

TOP_X=$(( WIDTH / 2 + OFFSET ))
BOTTOM_X=$(( WIDTH / 2 - OFFSET ))

MASK=$(mktemp --suffix=.png)
trap 'rm -f "$MASK"' EXIT

# White marks the area taken from the right-hand image.
magick -size "${WIDTH}x${HEIGHT}" xc:black \
  -fill white -draw "polygon $TOP_X,0 $WIDTH,0 $WIDTH,$HEIGHT $BOTTOM_X,$HEIGHT" \
  -alpha off "$MASK"

magick "$LEFT" "$RIGHT" "$MASK" -composite \
  -stroke "$STROKE" -strokewidth "$STROKE_WIDTH" \
  -draw "line $TOP_X,0 $BOTTOM_X,$HEIGHT" \
  "$OUT"

echo "wrote $OUT"
