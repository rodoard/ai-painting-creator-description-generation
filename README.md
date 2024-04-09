
# DaVinci's Mona Lisa: AI-Powered Painting Creator and Description Generator

This project is a web application that allows users to configure painting parameters and generate painting descriptions using an AI model. The application also includes a feature that calls the AI model to generate a painting based on the painting description it generated earlier. The user interface consists of two panels side by side: Painting Parameters and Painting Display.

## Prerequisites

To run this project, make sure you have the following installed:

- [SvelteKit](https://kit.svelte.dev/)
- [OpenAI API](https://beta.openai.com/docs/guides/quickstart)
- [Vercel AI SDK](https://vercel.com/docs/ai)

## Getting Started

1. Clone the repository:


```
git clone https://github.com/rodoard/ai-painting-creator-description-generator.git
```

2. Install dependencies:


```
npm install
```

3. Set up environment variables:

Create a .env file in the project root and add the following:


```
OPENAI_API_KEY=your_openai_api_key
```

4. Start the development server:


```
npm run dev
```

5. Access the application at http://localhost:5000

## Painting Description Generator

Users can configure paiting themes in the Painting  Parameters panel. Once the parameters are set, the AI model generates a paiting description based on the provided configuration.

## Painting Creator

After generating a painting description, the AI model generates a painting based on the description
it generated earlier.

## Technologies Used

- SvelteKit
- OpenAI API
- Vercel AI SDK

## Contributing

We welcome contributions from the community. Please submit a pull request if you'd like to contribute.

## License

This project is licensed under the MIT License.

## Additional Information

Much thanks to Encode Club for inspiring this project.
