# Changelog

## 2025-10-25

### Added
- Introduced a reusable `WalletProvider` context to manage MetaMask account state, connection status, and modal visibility.
- Created a polished `WalletModal` component that guides users through connecting MetaMask, surfaces errors, and shows the connected address.
- Declared a lightweight `ethereum` type definition to make the MetaMask provider consumable in TypeScript.

### Changed
- Updated `Navbar` to open the wallet modal and display the connected wallet address when present.
- Refreshed `DashboardPage` to consume wallet context, show live connection status, and support disconnecting directly from the dashboard.
- Wrapped the application in the new wallet context and rendered the wallet modal globally via `App.tsx`.

### Demo Video
- [Connect with Metamask while user has Metamask already installed](https://www.awesomescreenshot.com/video/45649214)
- [Connect with Metamask while user hasn't installed Metamask yet](https://www.awesomescreenshot.com/video/45649284?key=bfc720a8f0a7bd2a001c0de8d1f5a0a4)

### Further ideas
- Consider using SaaS like [WalletConnect](https://walletconnect.com/) for better wallet connection integration

### Contact
<Min Ju> route666@live.cn