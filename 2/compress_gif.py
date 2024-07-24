import imageio
from tqdm import tqdm
from PIL import Image


# def compress_gif(input_path, output_path, fps=10):
#     # Read the GIF file
#     reader = imageio.get_reader(input_path)
#     # Open the output GIF as a writer
#     writer = imageio.get_writer(output_path, fps=fps)

#     # Iterate through each frame and write to the new file
#     i = 0
#     for frame in tqdm(reader):
#         i += 1
#         if i % 3 == 0:
#             writer.append_data(frame)
#     writer.close()


def resize_gif(input_path, output_path, scale=0.5):
    reader = imageio.get_reader(input_path)
    writer = imageio.get_writer(output_path)

    for frame in tqdm(reader):
        img = Image.fromarray(frame)
        img = img.resize(
            (int(img.width * scale), int(img.height * scale)),
        )
        writer.append_data(imageio.imread(img))

    writer.close()


# Example usage


# Example usage
input_gif = "cc.gif"
output_gif = "ccc.gif"
resize_gif(input_gif, output_gif, scale=0.5)
