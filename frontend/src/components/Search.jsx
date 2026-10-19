import React from 'react'

function Search({
    searchTerm, onSearchChange,
    districtFilter, onDistrictChange,
    statusFilter, onStatusChange,
    priceSort, onPriceSortChange,
    capacitySort, onCapacitySortChange, 
    showStatusFilter
}) {
    return (
        <div className="search-filters">
            <h2 className="search-filters-title">Qidirish va filtrlash</h2>
            <div className="search-row">
                <input
                    type="text"
                    className="search-input"
                    placeholder="To'yxona nomi yoki manzili bo'yicha qidiring..."
                    id="search-input"
                    value={searchTerm}
                    onInput={onSearchChange}
                />
            </div>
            <div className="filter-row">
                <div className="filter-group">
                    <span className="filter-label">Tuman:</span>
                    <select
                        className="filter-select"
                        id="district-filter"
                        value={districtFilter}
                        onChange={onDistrictChange}
                    >
                        <option value="">Barcha tumanlar</option>
                        <option value="Yunusobod tumani">Yunusobod</option>
                        <option value="Chilonzor tumani">Chilonzor</option>
                        <option value="Mirzo-Ulug'bek tumani">Mirzo Ulug'bek</option>
                        <option value="Olmazor tumani">Olmazor</option>
                        <option value="Sergeli tumani">Sergeli</option>
                        <option value="Bektemir tumani">Bektemir</option>
                        <option value="Yakkasaroy tumani">Yakkasaroy</option>
                        <option value="Mirobod tumani">Mirobod</option>
                        <option value="Shayxontohur tumani">Shayxontohur</option>
                        <option value="Uchtepa tumani">Uchtepa</option>
                    </select>
                </div>
                <div className="filter-group">
                    <span className="filter-label">Narx bo'yicha saralash:</span>
                    <div className="sort-buttons">
                        <button
                            type='button'
                            className="sort-btn"
                            onClick={() => onPriceSortChange('asc')}
                        >
                            <i className="fas fa-sort-amount-up"></i>
                            O'sish
                        </button>
                        <button
                            type='button'
                            className="sort-btn"
                            onClick={() => onPriceSortChange('desc')}
                        >
                            <i className="fas fa-sort-amount-down"></i>
                            Kamayish
                        </button>
                    </div>
                </div>
                <div className="filter-group">
                    <span className="filter-label">Sig'imi bo'yicha:</span>
                    <div className="sort-buttons">
                        <button className="sort-btn" type='button' onClick={() => onCapacitySortChange('asc')}>
                            <i className="fas fa-sort-amount-up"></i>
                            O'sish
                        </button>
                        <button className="sort-btn" type='button' onClick={() => onCapacitySortChange('desc')}>
                            <i className="fas fa-sort-amount-down"></i>
                            Kamayish
                        </button>
                    </div>
                </div>

                {showStatusFilter && (
                    <div className="filter-group">
                        <span className="filter-label">Status:</span>
                        <select
                            className="filter-select"
                            id="status-filter"
                            value={statusFilter}
                            onChange={onStatusChange}
                        >
                            <option value="">Barcha statuslar</option>
                            <option value="Tasdiqlangan">Tasdiqlangan</option>
                            <option value="Tasdiqlanmagan">Tasdiqlanmagan</option>
                        </select>
                    </div>
                )}

            </div>
        </div>
    )
}

export default Search