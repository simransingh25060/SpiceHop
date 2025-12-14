import React, { useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [fileError, setFileError] = useState('');

    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const videoURL = useMemo(() => {
        if (!videoFile) return '';
        return URL.createObjectURL(videoFile);
    }, [videoFile]);

    useEffect(() => {
        if (videoURL) {
            return () => URL.revokeObjectURL(videoURL);
        }
    }, [videoURL]);

 
    const onFileChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) {
            setVideoFile(null);
            setFileError('');
            return;
        }

        if (!file.type.startsWith('video/')) {
            setFileError('Please select a valid video file.');
            return;
        }

        setFileError('');
        setVideoFile(file);
    };

  
    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer?.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('video/')) {
            setFileError('Please drop a valid video file.');
            return;
        }

        setFileError('');
        setVideoFile(file);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };


    const openFileDialog = () => fileInputRef.current?.click();

    
    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('video', videoFile);  // your original key unchanged

        const response = await axios.post("http://localhost:3000/api/food", formData, {
            withCredentials: true,
        });

        console.log(response.data);
        navigate('/partner-profile');
    };

    const isDisabled = useMemo(() => !name.trim() || !videoFile, [name, videoFile]);

    return (
        <div className="reels-page">
            <div className="phone-frame">
                <header className="phone-header">
                    <button className="header-back-btn" onClick={() => navigate('/partner-profile')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <div className="header-content">
                        <h1 className="brand-name">Create Recipe</h1>
                    </div>
                </header>

                <main className="phone-main" style={{ overflowY: 'auto' }}>
                    <div className="create-food-container">
                        <form className="create-food-form" onSubmit={onSubmit}>
                            <div className="field-group">
                                <label htmlFor="foodVideo">Recipe Video</label>

                                <input
                                    id="foodVideo"
                                    ref={fileInputRef}
                                    type="file"
                                    className="file-input-hidden"
                                    accept="video/*"
                                    onChange={onFileChange}
                                />

                                {!videoFile && (
                                    <div
                                        className="file-dropzone"
                                        role="button"
                                        tabIndex={0}
                                        onClick={openFileDialog}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                openFileDialog();
                                            }
                                        }}
                                        onDrop={onDrop}
                                        onDragOver={onDragOver}
                                    >
                                        <div className="file-dropzone-inner">
                                            <div className="file-icon">📹</div>
                                            <div className="file-dropzone-text">Tap to upload video</div>
                                            <div className="file-hint">MP4, MOV up to 50MB</div>
                                        </div>
                                    </div>
                                )}

                                {fileError && (
                                    <p className="error-text" role="alert">{fileError}</p>
                                )}

                                {videoFile && (
                                    <div className="file-chip" aria-live="polite">
                                        <span className="file-chip-name">{videoFile.name}</span>
                                        <span className="file-chip-size">
                                            {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                                        </span>

                                        <div className="file-chip-actions">
                                            <button type="button" className="btn-ghost" onClick={openFileDialog}>
                                                Change
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-ghost danger"
                                                onClick={() => { setVideoFile(null); setFileError(''); }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {videoURL && (
                                <div className="video-preview">
                                    <video className="video-preview-el" src={videoURL} controls />
                                </div>
                            )}

                            <div className="field-group">
                                <label htmlFor="foodName">Recipe Name</label>
                                <input
                                    id="foodName"
                                    type="text"
                                    value={name}
                                    placeholder="e.g. Classic Sandwich"
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="field-group">
                                <label htmlFor="foodDesc">Description</label>
                                <textarea
                                    id="foodDesc"
                                    rows={4}
                                    value={description}
                                    placeholder="Short description for the recipe"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="form-actions">
                                <button className="user-btn" type="submit" disabled={isDisabled}>
                                    <span>Publish Recipe</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreateFood;