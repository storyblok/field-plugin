import {
  createFieldPlugin,
  type FieldPluginResponse,
  type FieldPluginData,
  type FieldPluginActions,
} from '@storyblok/field-plugin'
import './style.css'

type Component = {
  html: (props: { data: FieldPluginData }) => string
  setup: (props: { actions: FieldPluginActions }) => void
  update: (props: { data: FieldPluginData }) => void
}

const rootElement = document.querySelector('#app')!
rootElement.innerHTML = `<span>Loading...</span>`
let previousType: FieldPluginResponse['type'] = 'loading'
let currentData: FieldPluginData

const modalCloseButton = ModalCloseButton()
const counter = Counter()
const modalToggle = ModalToggle()
const assetSelector = AssetSelector()
const components = [modalCloseButton, counter, modalToggle, assetSelector]

// Establish communication with the Visual Editor
createFieldPlugin((response) => {
  // Re-render the button element when messages
  const { data, actions, type } = response
  if (previousType === 'loading') {
    previousType = type
    if (type === 'error') {
      rootElement.innerHTML = `<span>Error</span>`
    } else if (type === 'loaded') {
      renderFieldPlugin({ data, actions })
    }
  } else {
    updateData(data!)
  }
})

function updateData(data: FieldPluginData) {
  currentData = data
  components.forEach((component) => component.update({ data }))
}

function renderFieldPlugin({
  data,
  actions,
}: {
  data: FieldPluginData
  actions: FieldPluginActions
}) {
  rootElement.innerHTML = `
    <div data-modal-open="false">
      ${modalCloseButton.html({ data })}
      <div class="container">
        ${counter.html({ data })}
        <hr />
        ${modalToggle.html({ data })}
        <hr />
        ${assetSelector.html({ data })}
      </div>
    </div>
  `

  updateData(data)
  components.forEach((component) => component.setup({ actions }))
}

function ModalCloseButton(): Component {
  return {
    html() {
      return `
      <button
        type="button"
        class="btn btn-close"
      >
        <svg
          width="14"
          height="14"
          view-box="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.75738 0.343176L0.343166 1.75739L4.58581 6.00003L0.343165 10.2427L1.75738 11.6569L6.00002 7.41424L10.2427 11.6569L11.6569 10.2427L7.41423 6.00003L11.6569 1.75739L10.2427 0.343176L6.00002 4.58582L1.75738 0.343176Z"
            fill="#1B243F"
          />
        </svg>
        <span class="sr-only">Close Modal</span>
      </button>
      `
    },
    setup({ actions }) {
      rootElement.querySelector('.btn-close')?.addEventListener('click', () => {
        actions.setModalOpen(!currentData.isModalOpen)
      })
    },
    update({ data }) {
      Array.from(rootElement.querySelectorAll('[data-modal-open]')).forEach(
        (element) => {
          element.setAttribute('data-modal-open', String(data.isModalOpen))
        },
      )
    },
  }
}

function Counter(): Component {
  return {
    html() {
      return `
        <div>
          <h2>Field Value</h2>
          <div class="counter-value"></div>
          <button class="btn w-full btn-increment">Increment</button>
        </div>
      `
    },
    setup({ actions }) {
      rootElement
        .querySelector('.btn-increment')
        ?.addEventListener('click', () => {
          actions.setValue(
            (typeof currentData.value === 'number' ? currentData.value : 0) + 1,
          )
        })
    },
    update({ data }) {
      const counterElement = rootElement.querySelector('.counter-value')
      if (counterElement) {
        counterElement.innerHTML =
          typeof data.value !== 'number' ? '0' : JSON.stringify(data.value)
      }
    },
  }
}

function ModalToggle(): Component {
  return {
    html() {
      return `
        <div>
          <h2>Modal</h2>
          <button class="btn w-full btn-modal-toggle" type="button"></button>
        </div>
      `
    },
    setup({ actions }) {
      rootElement
        .querySelector('.btn-modal-toggle')
        ?.addEventListener('click', () => {
          actions.setModalOpen(!currentData.isModalOpen)
        })
    },
    update({ data }) {
      const modalToggleButton = rootElement.querySelector('.btn-modal-toggle')
      if (modalToggleButton) {
        modalToggleButton.innerHTML =
          (data.isModalOpen ? 'Close' : 'Open') + ' modal'
      }
    },
  }
}

function AssetSelector(): Component {
  return {
    html() {
      return `
        <div class="asset-selector">
          <h2>Asset Selector</h2>
          <img title="Selected Asset" />
          <button class="btn w-full btn-remove-asset">Remove Asset</button>
          <button class="btn w-full btn-select-asset">Select Asset</button>
        </div>
      `
    },
    setup({ actions }) {
      rootElement
        .querySelector('.btn-select-asset')
        ?.addEventListener('click', async () => {
          const asset = await actions.selectAsset()
          document.querySelector('.asset-selector')?.classList.add('selected')
          document
            .querySelector('.asset-selector img')
            ?.setAttribute('src', asset.filename)
        })

      rootElement
        .querySelector('.btn-remove-asset')
        ?.addEventListener('click', () => {
          document
            .querySelector('.asset-selector')
            ?.classList.remove('selected')
          document.querySelector('.asset-selector img')?.setAttribute('src', '')
        })
    },
    update() {},
  }
}

// This error replaces another error which message is harder to understand and impossible to avoid util the issue https://github.com/storyblok/field-plugin/issues/107 has been resolved.
throw new Error(
  `This error can be safely ignored. It is caused by the legacy field plugin API. See issue https://github.com/storyblok/field-plugin/issues/107`,
)
