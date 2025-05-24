import React, { useState } from 'react';
import "./FoodSuggestion.css";

function FoodSuggestion() {
    const [ingredients, setIngredients] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getSuggestions = async () => {
        setError('');
        setSuggestions([]);
        setIsLoading(true);

        try {
            const ingredientsList = ingredients.split(',')
                .map(i => i.trim().toLowerCase())
                .filter(i => i.length > 0);

            const response = await fetch('http://localhost:3000/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ingredients: ingredientsList })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            setSuggestions(data.suggestions);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setIngredients('');
        setSuggestions([]);
        setError('');
    };

    return (
        <div className="food-suggestion-container">
            <div className="header-section">
                <h1 className="app-title">🍳 Food Suggestion App</h1>
                <p className="app-subtitle">Nhập nguyên liệu bạn có và nhận gợi ý món ăn</p>
            </div>

            <div className="input-section">
                <input
                    value={ingredients}
                    onChange={e => setIngredients(e.target.value)}
                    placeholder="Nhập nguyên liệu (cách nhau bằng dấu phẩy), ví dụ: trứng, hành, cà rốt"
                    className="ingredient-input"
                />
                <div className="button-group">
                    <button
                        onClick={getSuggestions}
                        className="suggest-button"
                        disabled={isLoading || !ingredients.trim()}
                    >
                        {isLoading ? 'Đang tìm kiếm...' : 'Gợi ý món ăn'}
                    </button>
                    <button
                        onClick={handleReset}
                        className="reset-button"
                        disabled={isLoading}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {error && <p className="error-message">{error}</p>}

            {suggestions.length > 0 && (
                <div className="suggestions-section">
                    <h2 className="suggestions-title">Gợi ý món ăn</h2>
                    <div className="suggestions-grid">
                        {suggestions.map((item, index) => (
                            <div key={index} className="recipe-card">
                                <h3 className="recipe-name">{item.name}</h3>
                                <div className="ingredients-list">
                                    <h4>Nguyên liệu cần:</h4>
                                    <ul>
                                        {item.ingredients.map((ing, i) => (
                                            <li key={i} className="ingredient-item">
                                                {ing}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FoodSuggestion;