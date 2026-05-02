from pdf2image import convert_from_path
try:
    images = convert_from_path('sample.pdf', poppler_path=r'C:\Program Files\poppler-25.12.0\Library\bin')
    print("Success:", len(images))
except Exception as e:
    print("Error:", e)
