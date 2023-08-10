#!/usr/bin/env bash

mkdir ./packages/field-plugin/dist/{react,vue2,vue3,vite}

cp -r ./packages/field-plugin/helpers/react/dist/* ./packages/field-plugin/dist/react/
cp -r ./packages/field-plugin/helpers/vue2/dist/* ./packages/field-plugin/dist/vue2/
cp -r ./packages/field-plugin/helpers/vue3/dist/* ./packages/field-plugin/dist/vue3/
cp -r ./packages/field-plugin/helpers/vite/dist/* ./packages/field-plugin/dist/vite/
