FROM python:3.12.7-slim

WORKDIR /app
COPY pyproject.toml .
RUN pip install --upgrade pip setuptools wheel
RUN pip install .
COPY . .

ENV FLASK_APP=run.py
ENV FLASK_ENV=production
EXPOSE 5000

CMD ["python", "-c", "from run import app; app.run(host='0.0.0.0', port=5000)"]