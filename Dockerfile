FROM postgres
#LABEL authors="evandrogiacomelli"

RUN usermod -u 1000 postgres

#ENTRYPOINT ["top", "-b"]
