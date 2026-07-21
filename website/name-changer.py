from PIL import Image
import os

folder_path = "./public/images"

# Get all files (ignore folders)
files = [
    f for f in os.listdir(folder_path)
    if os.path.isfile(os.path.join(folder_path, f))
]

# Sort files
files.sort()

counter = 1

for file in files:
    input_path = os.path.join(folder_path, file)

    # Open image
    img = Image.open(input_path)

    # Convert to RGB if image has transparency (PNG/WebP/etc.)
    if img.mode in ("RGBA", "P"):
        img = img.convert("RGB")

    # Output path
    output_image = os.path.join(
        folder_path,
        f"c-photo{counter}.jpg"
    )

    # Save compressed image
    img.save(
        output_image,
        optimize=True,
        quality=30
    )

    print(f"Compressed: {file} -> c-photo{counter}.jpg")

    counter += 1

print("Done resizing files!")