####################################################################################################
##@ Code Quality

forge-fmt-check:
	@forge fmt --check src || true
.PHONY: forge-fmt-check

forge-fmt:
	@forge fmt src || true
.PHONY: forge-fmt

check: forge-fmt-check ## Checks formatting & linting (no files touched)
.PHONY: check

format: forge-fmt ## Formats & lint (autofixes)
.PHONY: format
