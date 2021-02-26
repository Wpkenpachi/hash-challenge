FROM python:3

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
COPY .env.prod .env

RUN chmod +x proto-build.sh
RUN ./proto-build.sh

EXPOSE 50051
CMD ["python", "-u",  "server.py"]