# FF&E Analyzer AI

An intelligent interior design tool that leverages Google's Gemini 3 Pro model to identify, count, and localize Furniture, Fixtures, and Equipment (FF&E) in uploaded photos.

## Features

- **AI Object Detection**: Automatically identifies furniture, lighting, and decor items in interior images.
- **Visual Localization**: Draws precise bounding boxes around detected items to visualize placement.
- **Detailed Analysis**: Provides a specific label and visual description (material, color, style) for each item.
- **Design Summary**: Generates a brief overview of the room's style and collection.
- **Export to Excel**: Download the analyzed inventory list as a CSV file for reporting.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 3 Pro (via `@google/genai` SDK)

## How It Works

1.  **Image Upload**: The user provides an image of a room or specific furniture piece.
2.  **Gemini Analysis**: The image is sent to the Gemini 3 Pro model with a specialized system instruction to act as an FF&E expert.
3.  **Data Extraction**: The model returns a structured JSON response containing:
    *   A list of items with labels and descriptions.
    *   2D bounding box coordinates for each item.
    *   A summary of the design.
4.  **Visualization**: The app renders the bounding boxes over the original image and populates a data table.
5.  **Export**: Data is formatted into a CSV structure for easy export to Excel.

## Usage

1.  **Upload**: Drag and drop or select an interior design photo.
2.  **Analyze**: Wait for the AI to process the image and identify objects.
3.  **Review**: Hover over the bounding boxes to see labels, or check the table for full descriptions.
4.  **Export**: Click "Download Excel Report" to save the data.
