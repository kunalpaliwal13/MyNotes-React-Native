import os

# Get current working directory
folder_path = os.getcwd()

# Loop through all files in the folder
for filename in os.listdir(folder_path):
    if '-' in filename:
        new_name = filename.replace('-', '')
        old_path = os.path.join(folder_path, filename)
        new_path = os.path.join(folder_path, new_name)
        os.rename(old_path, new_path)
        print(f'Renamed: {filename} → {new_name}')
