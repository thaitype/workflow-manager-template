#!/bin/sh
ref=v1

git tag -d $ref
git push --delete origin $ref
git tag $ref
git push origin $ref