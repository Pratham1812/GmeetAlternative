// AboutUs.tsx
import HomeNavbar from '@/components/HomeNavbar';
import React from 'react';

const AboutUs: React.FC = () => {
    const contributors = [
        { name: 'Mohit Verma', username: 'emvee' , github: 'https://github.com/mohitvermax'},
        { name: 'Tanisha Dixit', username: 'rhapsody', github: 'https://github.com/tanishadixit0206' },
    ];

    return (
        <>
        <HomeNavbar/>
        <div className="container mx-auto p-8">
            <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
            
            <section className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">GMeet Alternative</h2>
                <p className="text-lg">
    Welcome to our hackathon project! This platform is designed to revolutionize online meetings by integrating advanced features such as AI-powered summarization and transcription. We have built the entire WebRTC infrastructure from the ground up, ensuring seamless real-time video and audio communication. Our goal is to provide an intuitive and efficient meeting experience that leverages cutting-edge technology to enhance productivity and collaboration.
                </p>
                <a 
                    href="https://github.com/GmeetAlternative/GmeetAlternative" // Replace with your actual GitHub repo link
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline"
                >
                    View our GitHub Repository
                </a>

            </section>
            
            <section className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Tech Stack</h2>
                <ul className="list-disc list-inside text-lg">
                    <li>Frontend: Next.js Tailwind CSS</li>
                    <li>Backend: Node.js, Express</li>
                    <li>AI Services: Speech-to-Text and Text summarization APIs</li>
                    <li>Database: MongoDB</li>
                    <li>Realtime Communication: Socket.io, WebRTC</li>
                </ul>
            </section>
            
            <section className="mb-12">
                <h2 className="text-3xl font-semibold mb-4">Features</h2>
                <ul className="list-disc list-inside text-lg">
                    <li>Realtime Video Conferencing: Seamless video communication with low latency.</li>
                    <li>AI Summarization: Get concise summaries of your meetings.</li>
                    <li>Screen Sharing: Share screens during meetings.</li>
                </ul>
            </section>
            
            <section>
                <h2 className="text-3xl font-semibold mb-4">Contributors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {contributors.map((contributor, index) => (
                        <div key={index} className="border p-4 rounded-lg shadow-lg">
                            <h3 className="text-2xl font-bold">{contributor.name}</h3>
                            <p className="text-lg">{contributor.username}</p>
                            <a 
                                href={contributor.github} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-blue-500 hover:underline mt-2 block"
                            >
                                GitHub Profile
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
        </>
    );
};

export default AboutUs;
