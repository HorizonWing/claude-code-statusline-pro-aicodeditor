#!/bin/bash

set -e

echo "📦 NPM Package Publishing Script"
echo "================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get current registry
echo -e "${BLUE}🔍 Getting current npm registry...${NC}"
ORIGINAL_REGISTRY=$(npm config get registry)
echo -e "${GREEN}Current registry: ${ORIGINAL_REGISTRY}${NC}"
echo ""

# Set registry to npmjs
echo -e "${BLUE}🔄 Switching to npmjs registry...${NC}"
npm config set registry https://registry.npmjs.org/
echo -e "${GREEN}✓ Registry switched to https://registry.npmjs.org/${NC}"
echo ""

# Cleanup function to restore original registry
cleanup() {
  echo ""
  echo -e "${BLUE}🔄 Restoring original registry...${NC}"
  npm config set registry "$ORIGINAL_REGISTRY"
  echo -e "${GREEN}✓ Registry restored to: ${ORIGINAL_REGISTRY}${NC}"
}

# Set trap to restore registry on exit (success or failure)
trap cleanup EXIT

# Check authentication
echo -e "${BLUE}🔐 Checking npm authentication...${NC}"
if npm whoami &> /dev/null; then
  CURRENT_USER=$(npm whoami)
  echo -e "${GREEN}✓ Already authenticated as: ${CURRENT_USER}${NC}"
  echo ""
else
  echo -e "${YELLOW}⚠ Not authenticated, logging in...${NC}"
  npm login
  echo ""
  if npm whoami &> /dev/null; then
    CURRENT_USER=$(npm whoami)
    echo -e "${GREEN}✓ Successfully authenticated as: ${CURRENT_USER}${NC}"
    echo ""
  else
    echo -e "${RED}❌ Authentication failed${NC}"
    exit 1
  fi
fi

# Verify package.json exists
if [ ! -f "package.json" ]; then
  echo -e "${RED}❌ Error: package.json not found in current directory${NC}"
  exit 1
fi

# Show package info
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
echo -e "${BLUE}📋 Package Information:${NC}"
echo -e "  Name: ${GREEN}${PACKAGE_NAME}${NC}"
echo -e "  Version: ${GREEN}${PACKAGE_VERSION}${NC}"
echo ""

# Build if build script exists
if grep -q '"build"' package.json; then
  echo -e "${BLUE}🔨 Running build...${NC}"
  npm run build
  echo -e "${GREEN}✓ Build completed${NC}"
  echo ""
fi

# Publish the package
echo -e "${BLUE}🚀 Publishing package...${NC}"
npm publish

echo ""
echo -e "${GREEN}✅ Package published successfully!${NC}"
echo -e "${GREEN}View at: https://www.npmjs.com/package/${PACKAGE_NAME}${NC}"
