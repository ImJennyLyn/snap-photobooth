# Snap PhotoBooth

Snap PhotoBooth is a web-based photo booth application that allows users to capture photos using their webcam, edit them by adding stickers and text, and then save or download the final images. It features a user-friendly interface, with interactive tools for customization and editing.

This project was built using **React** and integrates **Webcam** for photo capture, **html2canvas** for image manipulation, and **axios** for backend interactions. The app provides an engaging experience for creating and editing personalized photos.

---

## Features

- Capture photos using the webcam
- Countdown timer before each photo is captured
- Add stickers and text to the captured photos
- Download the image
- User-friendly interface with real-time photo preview

---

## Camera Page

The **Camera Page** allows users to capture up to three photos with a countdown timer for each capture. After capturing, users can review the images and proceed to the next page for editing.

### Features on the Camera Page:
- **Webcam integration** for live photo capture
- **Countdown timer** before taking the photo
- **Capture** button for photo capturing
- **Retake** button to re-take the photos
- **Next** button to navigate to the editing page after capturing three photos

![490986410_951219207089646_6181851924530267794_n](https://github.com/user-attachments/assets/85830da0-07f0-4f21-a5f5-72612f98543b) <!-- Replace with the actual image path -->

---

## Edit Page


The **Edit Page** enables users to customize their captured photos by adding stickers and text. They can select a background color, place text or stickers on the image, and download or save the final result.

### Features on the Edit Page:
- **Choose a background color**
- **Add stickers** from a predefined set of emojis
- **Add custom text** with customizable fonts
- **Drag and drop** text and stickers to place them on the image
- **Delete** text or stickers in "Delete Mode"
- **Download** the combined image as one photo
- **Save** the edited image to the database

![490998701_969263681956429_2813074278678452307_n](https://github.com/user-attachments/assets/cd926dcc-0fc9-48f1-8736-1c16d39ba355)

---

## Getting Started

To get started with the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/snap-photobooth.git
