FROM postgres
#LABEL User="evandrogiacomelli"

RUN usermod -u 1000 postgres

#ENTRYPOINT ["top", "-b"]
