#!/bin/bash
rm -r output/
##
mkdir -p output/img
mkdir -p output/fonts

## app files
cp ressources/fonts/* output/fonts/
cp ressources/svg/* output/img/
cp ressources/img/* output/img/
cp ressources/infocards-images/* output/img/

echo 0
