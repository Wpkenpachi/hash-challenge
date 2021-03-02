FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY .env.prod .env

RUN chmod +x protobuild
RUN sh protobuild

EXPOSE 50051
CMD ["python", "-u",  "server.py"]