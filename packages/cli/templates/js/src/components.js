let currentData

const modalCloseButton = ModalCloseButton()
const counter = Counter()
const modalToggle = ModalToggle()
const assetSelector = AssetSelector()
const components = [modalCloseButton, counter, modalToggle, assetSelector]

export function updateData({ container, data }) {
  currentData = data
  components.forEach((component) => component.update({ container, data }))
}

export function renderFieldPlugin({ data, actions, container }) {
  container.innerHTML = `
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

  updateData({ container, data })
  components.forEach((component) => component.setup({ container, actions }))
}

function ModalCloseButton() {
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
    setup({ container, actions }) {
      container.querySelector('.btn-close').addEventListener('click', () => {
        actions.setModalOpen(!currentData.isModalOpen)
      })
    },
    update({ container, data }) {
      Array.from(container.querySelectorAll('[data-modal-open]')).forEach(
        (element) => {
          element.setAttribute('data-modal-open', String(data.isModalOpen))
        },
      )
    },
  }
}

function Counter() {
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
    setup({ container, actions }) {
      container
        .querySelector('.btn-increment')
        .addEventListener('click', () => {
          actions.setContent(
            (typeof currentData.content === 'number'
              ? currentData.content
              : 0) + 1,
          )
        })
    },
    update({ container, data }) {
      const counterElement = container.querySelector('.counter-value')
      if (counterElement) {
        counterElement.innerHTML =
          typeof data.content !== 'number' ? '0' : JSON.stringify(data.content)
      }
    },
  }
}

function ModalToggle() {
  return {
    html() {
      return `
        <div>
          <h2>Modal</h2>
          <button class="btn w-full btn-modal-toggle" type="button"></button>
        </div>
      `
    },
    setup({ container, actions }) {
      container
        .querySelector('.btn-modal-toggle')
        .addEventListener('click', () => {
          actions.setModalOpen(!currentData.isModalOpen)
        })
    },
    update({ container, data }) {
      const modalToggleButton = container.querySelector('.btn-modal-toggle')
      if (modalToggleButton) {
        modalToggleButton.innerHTML =
          (data.isModalOpen ? 'Close' : 'Open') + ' modal'
      }
    },
  }
}

function AssetSelector() {
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
    setup({ container, actions }) {
      container
        .querySelector('.btn-select-asset')
        .addEventListener('click', async () => {
          const asset = await actions.selectAsset()
          document.querySelector('.asset-selector').classList.add('selected')
          document
            .querySelector('.asset-selector img')
            .setAttribute('src', asset.filename)
        })

      container
        .querySelector('.btn-remove-asset')
        .addEventListener('click', () => {
          document.querySelector('.asset-selector').classList.remove('selected')
          document.querySelector('.asset-selector img').setAttribute('src', '')
        })
    },
    update() {},
  }
}
