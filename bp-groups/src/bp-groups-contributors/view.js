/**
 * Use this file for JavaScript code that you want to run in the front-end
 */

let contributorsBlocks

const showAllContributors = (block) => {
	const hiddenContributors = block.querySelectorAll(
		'.bp-groups-contributors__avatar[hidden]',
	)
	hiddenContributors.forEach((contributor, index) => {
		setTimeout(() => {
			contributor.removeAttribute('hidden')
			contributor.classList.add('fade-in')
		}, 20 * index)
	})
}

const eventListeners = () => {
	contributorsBlocks.forEach((block) => {
		const viewButton = block.querySelector(
			'.bp-groups-contributors__view-all',
		)

		if (viewButton) {
			viewButton.addEventListener('click', () => {
				showAllContributors(block)
				viewButton.setAttribute('hidden', true)
			})
		}
	})
}

const init = () => {
	contributorsBlocks = document.querySelectorAll(
		'.wp-block-a8csp-bp-groups-contributors',
	)

	if (contributorsBlocks.length > 0) {
		eventListeners()
	}
}

document.addEventListener('DOMContentLoaded', init)
