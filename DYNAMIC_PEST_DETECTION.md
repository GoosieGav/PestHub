# Dynamic Pest Detection Feature

## Overview
PEST-Hub now has the ability to identify and generate comprehensive information for **any agricultural pest**, not just the 12 pre-defined ones!

## How It Works

### 1. **Dual-Mode Detection**
When you upload an image, Gemini AI now:
- First checks if it matches one of the 12 default pests (Ants, Bees, Beetles, Caterpillars, Earthworms, Earwigs, Grasshoppers, Moths, Slugs, Snails, Wasps, Weevils)
- If not, it identifies what pest it actually is and generates information on-the-fly

### 2. **Automatic Information Generation**
For new/unknown pests, the system automatically creates:
- **Scientific name and classification**
- **Detailed description** of the pest
- **5 damage symptoms** to watch for
- **5 organic treatment methods**
- **5 chemical treatment methods**
- **5 prevention strategies**
- **3 common species variants** with descriptions

### 3. **Full Information Pages**
New pests get complete information pages just like the default 12, including:
- Professional layout with all pest details
- AI-generated badge to indicate dynamic content
- Treatment recommendations
- Prevention strategies
- Everything a farmer needs to manage the pest

## Technical Implementation

### Backend Changes (`app.py`)
1. **Modified `predict_image()` function**
   - Now returns 5 values: `pest_name`, `confidence`, `is_known_pest`, `scientific_name`, `description`
   - First attempts to match against known pests
   - If no match, identifies the actual pest

2. **Added `generate_pest_info()` function**
   - Takes pest name and image as input
   - Calls Gemini AI with comprehensive prompt
   - Parses structured response into pest data dictionary
   - Returns complete pest information

3. **Updated `/predict` endpoint**
   - Detects if pest is known or unknown
   - For unknown pests, calls `generate_pest_info()`
   - Stores dynamic pest data in Flask session
   - Returns special flag `is_new: true` for frontend

4. **Updated `/pest/<pest_name>` route**
   - First checks static pest database
   - Then checks session for dynamically generated pests
   - Returns appropriate pest information page

5. **Added session support**
   - Imported `session` from Flask
   - Generated secure secret key for session management
   - Stores dynamic pests in `session['dynamic_pests']`

### Frontend Changes

#### `templates/index.html`
- Updated result display to show "🤖 NEW PEST DETECTED - AI Generated Info" for unknown pests
- Handles `is_new` flag from backend response

#### `templates/pest_info.html`
- Added AI placeholder for pest images (not in default set)
- Added AI-generated notice for damage images
- Conditional rendering based on whether pest is in known list

#### `assets/css/pest-info.css`
- Styled `.ai-pest-placeholder` for main pest image
- Styled `.ai-generated-notice` for damage image placeholder
- Modern gradient backgrounds with icon displays

## Visual Indicators

### New Pest Detection
When a new pest is detected, users will see:
- 🤖 emoji and "NEW PEST DETECTED - AI Generated Info" message
- Confidence score as usual
- Link to dynamically generated information page

### Information Pages
For AI-generated pests:
- Pest image shows an AI badge with bug icon if no photo available
- Damage section shows AI-generated notice instead of photo
- All text content is professionally formatted and comprehensive

## Session Management
- Dynamic pest information is stored in Flask sessions
- Persists for the duration of the user's session
- Each pest is stored with a unique key
- Automatically cleaned up when session expires

## Testing the Feature

To test with non-default pests, try uploading images of:
- Aphids
- Mealybugs
- Spider mites
- Whiteflies
- Scale insects
- Cutworms
- Armyworms
- Leafhoppers
- Thrips
- Any other agricultural pest

The system will:
1. Identify it as a new pest
2. Generate comprehensive information
3. Create a full information page
4. Store it in your session for future reference

## Benefits

1. **Unlimited Pest Database**: No longer limited to 12 pests
2. **Real-time Adaptation**: Handles any pest a farmer encounters
3. **Comprehensive Information**: Same detail level as default pests
4. **Cost-effective**: No need to manually add pest data
5. **Scalable**: Works for regional/rare pests automatically

## API Calls
Each new pest detection makes 2 Gemini API calls:
1. Initial identification (determines if known or new)
2. Comprehensive information generation (only for new pests)

Default pests only require 1 API call (identification only).

