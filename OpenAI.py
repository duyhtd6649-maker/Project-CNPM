from openai import OpenAI

client = OpenAI()

response = client.responses.create(
    model="gpt-4.1-mini",
    input="1+1 = may"
)

print(response.output_text)

#len cho ae qua API co ve se tinh phi nha, tai nay gio test thi chua thay tinh, co gi ae cu test bang input o tren nhe
