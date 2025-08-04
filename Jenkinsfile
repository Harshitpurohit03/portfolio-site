pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1' // your region
        ECR_REPO = 'portfolio-site' // your ECR repo name
        IMAGE_TAG = 'latest'
        LAMBDA_FUNCTION_NAME = 'Demo-app' // your Lambda name
    }

    stages {
        stage('Clone GitHub Repo') {
            steps {
                git url: 'https://github.com/Harshitpurohit03/portfolio-site.git', branch: 'main'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                script {
                    sh '''
                        aws ecr get-login-password --region $AWS_REGION | \
                        docker login --username AWS --password-stdin $(aws sts get-caller-identity --query "Account" --output text).dkr.ecr.$AWS_REGION.amazonaws.com
                    '''
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh '''
                        ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
                        docker build -t $ECR_REPO:$IMAGE_TAG .
                        docker tag $ECR_REPO:$IMAGE_TAG $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script {
                    sh '''
                        ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
                        docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG
                    '''
                }
            }
        }

        stage('Update Lambda with Latest Image') {
            steps {
                script {
                    sh '''
                        ACCOUNT_ID=$(aws sts get-caller-identity --query "Account" --output text)
                        aws lambda update-function-code \
                            --function-name $LAMBDA_FUNCTION_NAME \
                            --image-uri $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO:$IMAGE_TAG \
                            --region $AWS_REGION
                    '''
                }
            }
        }
    }
}
