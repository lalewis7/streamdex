# Streamdex AWS Documentation

This documentation goes over the maintenance and operations of the Streamdex AWS account. All credentials for the account are available at the [Streamdex Credential Repository][1].

## Setting up a new EC2 instance

### Getting Started

1. [Create a key pair][10] for the EC2 instance.

   - Name: streamdex_key_pair
   - Key pair type: RSA
   - Private key file format: .pem

2. Save key pair file to the [Streamdex Credential Repository][1].

### Launching the instance

1. Sign into the [AWS console][2] and login.

2. Navigate to the [EC2 page][3].

3. Navigate to the [Instances page][4] and [launch a new instance][5].

   - Name: Streamdex
   - AMI: Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
   - Architecture: 64-bit (x86)
   - Instance type: t2.micro
   - Key pair name: streamdex_key_pair
   - 

TODO

### Connecting to the instance

1. Create a key pair file.

2. [Convert your private key using PuTTYgen][6]

3. [Connect to your Linux instance][7] using Putty. Although usually I just connect using the SSH command. You can copy a full SSH command from the [connect page][8] of your instance.

> It is also helpful to install WinSCP to [Transfer files to your Linux instance][9].

## Connnecting to the EC2 instance

- 

> It is also helpful to install WinSCP to [Transfer files to your Linux instance][9].

[1]: https://github.com/lalewis7/streamdex-cred
[2]: https://aws.amazon.com/
[3]: https://us-east-1.console.aws.amazon.com/ec2/home
[4]: https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#Instances:
[5]: https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#LaunchInstances:
[6]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html#putty-private-key
[7]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html#putty-ssh
[8]: https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#ConnectToInstance:instanceId=i-07ff11e7a5a5c86e4
[9]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html#Transfer_WinSCP
[10]: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/create-key-pairs.html