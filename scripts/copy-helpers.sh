#!/usr/bin/env bash

mkdir ./packages/field-plugin/dist/{react,vue3}

cp -r ./packages/helper-react/dist/* ./packages/field-plugin/dist/react/
# cp -r ./packages/helper-vue3/dist/* ./packages/field-plugin/dist/vue3/

