FROM public.ecr.aws/lambda/nodejs:18

# Set working directory
WORKDIR /var/task

# Copy package.json and install dependencies
COPY package.json .
RUN npm install

# Copy source code
COPY lambda.js .
COPY . /var/task/public/

# Lambda entry point
CMD ["lambda.handler"]

