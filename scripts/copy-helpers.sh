#!/usr/bin/env bash

mkdir ./packages/field-plugin/dist/{react,vue2,vue3}

cp -r ./packages/helper-react/dist/* ./packages/field-plugin/dist/react/
cp -r ./packages/helper-vue2/dist/* ./packages/field-plugin/dist/vue2/
cp -r ./packages/helper-vue3/dist/* ./packages/field-plugin/dist/vue3/

