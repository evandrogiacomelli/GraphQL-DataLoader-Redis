FROM postgres
#LABEL Dependents="evandrogiacomelli"

RUN usermod -u 1000 postgres

#ENTRYPOINT ["top", "-b"]
