# AutomataSim

AutomataSim is a web application that allows users to build, simulate, and share Definite Finite Automatons (DFA), Push Down Automatons (PDA), and Turing Machines. It is built using the Next.js framework, React library, TailwindCSS, Firebase, TypeScript, and deployed on Vercel.

![AutomataSim Screenshot](https://automatasim.husainshahidrao.com/images/automatasim.png)

## Features

- Build and simulate DFAs, PDAs, and Turing Machines.
- Save and load automatons.
- Share automatons with others.
- Check whether a given string is accepted by the automaton or not.
- View transition tables and diagrams.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Yarn (v1.22.10 or later)

### Installation

1. Clone the repository.
2. Install dependencies with `yarn`.
3. Add your Firebase configuration in a `.env.local` file. An example is given in `.env.example`.
4. Run the development server with `yarn dev`.

```sh
git clone https://github.com/husain3012/automatasim.git
cd automatasim
yarn
cp .env.example .env.local # replace with your own Firebase config
yarn dev
```
The development server will start at ```http://localhost:3000```

### Deployment
AutomataSim is currently deployed at automatasim.husainshahidrao.com. You can deploy it on your own Vercel account by clicking the button below:

[![Deploy on Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/%3Chusain3012%3E/automatasim)

### Contributing
Contributions are welcome! Please create an issue first to discuss the proposed changes. Before submitting a pull request, make sure to run ```yarn lint``` and ```yarn test``` to ensure that there are no linting or testing errors.

### License
AutomataSim is licensed under the <strong>MIT License</strong>.
