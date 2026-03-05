#!/bin/bash
# Claude PPT Skill -- installer
# Usage: bash install.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TARGET_DIR="$(pwd)"

echo "🎬 Claude PPT Skill 설치"
echo "   대상: $TARGET_DIR"
echo ""

# 1. Copy skill
mkdir -p "$TARGET_DIR/.claude/skills/ppt"
cp "$SCRIPT_DIR/.claude/skills/ppt/SKILL.md" "$TARGET_DIR/.claude/skills/ppt/SKILL.md"
echo "✅ SKILL.md → .claude/skills/ppt/"

# 2. Copy ppt-preview.html
cp "$SCRIPT_DIR/assets/ppt-preview.html" "$TARGET_DIR/.claude/ppt-preview.html"
echo "✅ ppt-preview.html → .claude/"

# 3. Copy slide templates
mkdir -p "$TARGET_DIR/.claude/skills/ppt/templates"
cp "$SCRIPT_DIR/templates/slide-templates.json" "$TARGET_DIR/.claude/skills/ppt/templates/"
echo "✅ slide-templates.json → .claude/skills/ppt/templates/"

# 4. Copy Remotion reference components
mkdir -p "$TARGET_DIR/.claude/skills/ppt/templates/remotion/slides"
cp "$SCRIPT_DIR/templates/remotion/PptComposition.tsx" "$TARGET_DIR/.claude/skills/ppt/templates/remotion/"
cp "$SCRIPT_DIR/templates/remotion/Root.tsx" "$TARGET_DIR/.claude/skills/ppt/templates/remotion/"
cp "$SCRIPT_DIR/templates/remotion/utils.ts" "$TARGET_DIR/.claude/skills/ppt/templates/remotion/"
cp "$SCRIPT_DIR/templates/remotion/slides/"*.tsx "$TARGET_DIR/.claude/skills/ppt/templates/remotion/slides/"
echo "✅ remotion/ → .claude/skills/ppt/templates/remotion/"

echo ""
echo "🎉 설치 완료!"
echo ""
echo "사용법:"
echo "  1. Claude Code에서: PPT 만들어줘"
echo "  2. 또는 브라우저에서 미리보기: open .claude/ppt-preview.html"
echo ""
