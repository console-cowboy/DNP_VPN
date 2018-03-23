# DNP_VPN

Dappnode package responsible for providing the VPN connection

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- git

   Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) commandline tool.

- docker

   Install [docker](https://docs.docker.com/engine/installation). The community edition (docker-ce) will work. In Linux make sure you grant permissions to the current user to use docker by adding current user to docker group, `sudo usermod -aG docker $USER`. Once you update the users group, exit from the current terminal and open a new one to make effect.

- docker-compose

   Install [docker-compose](https://docs.docker.com/compose/install)
   
**Note**: Make sure you can run `git`, `docker ps`, `docker-compose` without any issue and without sudo command.

### Building

```
$ git clone https://github.com/dappnode/DNP_VPN.git
```

```
$ docker-compose build
or 
$ docker build --rm -f build/Dockerfile -t dnp_vpn:dev build 
```

## Running

### Start
```
$ docker-compose up -d
```
### Stop
```
$ docker-compose down
```
### Status
```
$ docker-compose ps
```
### Logs
```
$ docker-compose logs -f
```

**Note**: In case of having the port 8080 occupied, you should change them in the file docker-compose.yml by other.

## Generating a tar.xz image

[xz](https://tukaani.org/xz/) is required 

```
$ docker save dnp_vpn:dev | xz -9 > dnp_vpn.tar.xz
```

You can download the latest tar.xz version from here [releases](https://github.com/dappnode/DNP_VPN/releases).

### Loading a Docker image

```
$docker load -i dnp_vpn.tar.xz
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/dappnode) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/dappnode/DNP_VPN/tags). 

## Authors

* **Eduardo Antuña Díez** - *Initial work* - [eduadiez](https://github.com/eduadiez)

See also the list of [contributors](https://github.com/dappnode/DNP_VPN/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## References

[git](https://git-scm.com/) 

[docker](https://www.docker.com/)

[docker-compose](https://docs.docker.com/compose/)
