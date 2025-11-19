import React, { useEffect, useRef, useState, useMemo } from 'react';
import axios from 'axios';
import '../../styles/create-food.css';
import { useNavigate } from 'react-router-dom';

const CreateFood = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState('');
    const [fileError, setFileError] = useState('');

    const fileInputRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        if (!videoFile) {
            setVideoURL('');
            return;
        }

        const url = URL.createObjectURL(videoFile);
        setVideoURL(url);

        return () => URL.revokeObjectURL(url);
    }, [videoFile]);

 
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
        navigate('/');
    };

    const isDisabled = useMemo(() => !name.trim() || !videoFile, [name, videoFile]);

    return (
        <div className="create-food-page">
            <div className="create-food-card">
                <header className="create-food-header">
                    <h1 className="create-food-title">Create new food item</h1>
                    <p className="create-food-subtitle">
                        Add a short video, name and description for the food item. Videos help promote your store.
                    </p>
                </header>

                <form className="create-food-form" onSubmit={onSubmit}>
                    <div className="field-group">
                        <label htmlFor="foodVideo">Food Video</label>

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
                                    <div className="file-dropzone-text">Tap to upload or drag a video</div>
                                    <div className="file-hint">MP4, MOV up to ~50MB</div>
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
                        <label htmlFor="foodName">Name</label>
                        <input
                            id="foodName"
                            type="text"
                            value={name}
                            placeholder="e.g. Classic Sandwich"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

       
                    <div className="field-group">
                        <label htmlFor="foodDesc">Description</label>
                        <textarea
                            id="foodDesc"
                            rows={4}
                            value={description}
                            placeholder="Short description for the item (shown in feeds)"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button className="btn-primary" type="submit" disabled={isDisabled}>
                            Save Food
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFood;
