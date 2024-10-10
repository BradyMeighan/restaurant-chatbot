// frontend/src/components/Chatbot.js

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import './Chatbot.css';

const sampleResponses = [
    "Show me today's specials.",
    "I'm interested in vegan options.",
    "What desserts do you offer?",
    "Can you recommend a wine pairing?",
    "I'd like to make a reservation.",
    "Do you have gluten-free dishes?",
    "What's the ambiance like?",
    "Are there any live music nights?",
    "Can I get nutritional information?",
    "What are your opening hours?"
];

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! How can I assist you with our menu today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const sendMessage = async (message = input) => {
        if (message.trim() === '') return;

        const userMessage = { sender: 'user', text: message };
        setMessages(prevMessages => [...prevMessages, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post(`/api/chat`, {
                message,
                history: messages.filter(msg => msg.sender === 'user' || msg.sender === 'bot')
            });
            const botMessage = { sender: 'bot', text: response.data.message };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = { sender: 'bot', text: 'Sorry, something went wrong. Please try again later.' };
            setMessages(prevMessages => [...prevMessages, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const handleSampleClick = (sample) => {
        sendMessage(sample);
    };

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatbot-wrapper">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="chatbot-container"
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="chat-header">
                            <h2>McGarry's Coastal Kitchen</h2>
                            <button className="close-button" onClick={toggleChatbot} aria-label="Close Chatbot">
                                <FaTimes />
                            </button>
                        </div>
                        <div className="chat-messages">
                            <AnimatePresence>
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={index}
                                        className={`message ${msg.sender}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <div className="message-text">{msg.text}</div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {loading && (
                                <div className="typing-indicator">
                                    <span>Bot is typing</span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                    <span className="dot"></span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="sample-responses">
                            <div className="samples-scroll-container">
                                {sampleResponses.map((sample, index) => (
                                    <motion.button
                                        key={index}
                                        className="sample-button"
                                        onClick={() => handleSampleClick(sample)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        aria-label={`Sample response: ${sample}`}
                                    >
                                        {sample}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                aria-label="Type your message"
                            />
                            <motion.button
                                onClick={() => sendMessage()}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                aria-label="Send message"
                            >
                                <FaPaperPlane className="send-icon" />
                                Send
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isOpen && (
                <motion.button
                    className="open-chatbot-button"
                    onClick={toggleChatbot}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    aria-label="Open Chatbot"
                >
                    💬
                </motion.button>
            )}
        </div>
    );

};

export default Chatbot;
