import React, { useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import type { Branch } from '../../types';
import { BRANCHES, CITIES } from '../../data/constants';

interface BranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBranch: Branch;
  onSelectBranch: (branch: Branch) => void;
}

export const BranchModal: React.FC<BranchModalProps> = ({
  isOpen,
  onClose,
  selectedBranch,
  onSelectBranch,
}) => {
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('Tất cả');
  const [branchSearchQuery, setBranchSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const citiesList = CITIES.filter(c => c !== 'Tất cả');
  const filteredCities = selectedCityFilter === 'Tất cả' ? citiesList : [selectedCityFilter];
  let totalMatches = 0;

  return (
    <div className="modal-backdrop">
      <div
        className="modal-content"
        style={{
          maxWidth: '400px',
          textAlign: 'left',
          position: 'relative',
          padding: '22px 18px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'var(--wood-light)',
            border: 'none',
            width: 30,
            height: 30,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--wood-dark)',
            zIndex: 10,
          }}
        >
          <X size={16} />
        </button>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={20} color="var(--red-primary)" />
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--wood-dark)' }}>
              Hệ thống chi nhánh Spicy Box
            </h3>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--wood-medium)', marginTop: '4px' }}>
            Chọn tỉnh/thành phố để xem các cơ sở Spicy Box gần bạn nhất
          </p>
        </div>

        {/* Ô tìm kiếm nhanh chi nhánh */}
        <div style={{ position: 'relative', marginBottom: '10px' }}>
          <Search
            size={15}
            color="var(--wood-medium)"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Tìm theo tên TTTM, đường, quận huyện..."
            value={branchSearchQuery}
            onChange={e => setBranchSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 34px',
              borderRadius: '12px',
              border: '1.5px solid var(--wood-tint)',
              fontSize: '12px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {branchSearchQuery && (
            <button
              onClick={() => setBranchSearchQuery('')}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--wood-medium)',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Thanh chọn nhanh Tỉnh / Thành phố */}
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '10px',
          }}
        >
          {CITIES.map(cityName => {
            const count =
              cityName === 'Tất cả'
                ? BRANCHES.length
                : BRANCHES.filter(b => b.city === cityName).length;
            return (
              <button
                key={cityName}
                onClick={() => setSelectedCityFilter(cityName)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  background:
                    selectedCityFilter === cityName
                      ? 'var(--red-primary)'
                      : 'var(--bg-surface-subtle)',
                  color: selectedCityFilter === cityName ? '#fff' : 'var(--wood-dark)',
                  transition: 'all 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>{cityName}</span>
                <span
                  style={{
                    fontSize: '10px',
                    background:
                      selectedCityFilter === cityName
                        ? 'rgba(255,255,255,0.25)'
                        : 'var(--wood-light)',
                    padding: '1px 5px',
                    borderRadius: '9999px',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Danh sách chi nhánh gom theo thành phố */}
        <div
          style={{
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            paddingRight: '4px',
          }}
        >
          {(() => {
            const cityBlocks = filteredCities.map(cityName => {
              const branchesInCity = BRANCHES.filter(b => {
                const matchCity = b.city === cityName;
                const matchSearch =
                  !branchSearchQuery.trim() ||
                  b.name.toLowerCase().includes(branchSearchQuery.toLowerCase()) ||
                  b.mall.toLowerCase().includes(branchSearchQuery.toLowerCase()) ||
                  b.address.toLowerCase().includes(branchSearchQuery.toLowerCase());
                return matchCity && matchSearch;
              });

              if (branchesInCity.length === 0) return null;
              totalMatches += branchesInCity.length;

              return (
                <div key={cityName} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 6px',
                      borderBottom: '1.5px solid var(--wood-light)',
                      position: 'sticky',
                      top: 0,
                      background: 'var(--bg-surface)',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        color: 'var(--red-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>🏙️</span>
                      <span>{cityName.toUpperCase()}</span>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--wood-medium)',
                        fontWeight: 600,
                      }}
                    >
                      {branchesInCity.length} cơ sở
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {branchesInCity.map(b => {
                      const isSelected = selectedBranch.id === b.id;
                      return (
                        <div
                          key={b.id}
                          onClick={() => onSelectBranch(b)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: '14px',
                            border: isSelected
                              ? '2px solid var(--red-primary)'
                              : '1.5px solid var(--wood-tint)',
                            background: isSelected ? '#FEF2F2' : 'var(--bg-surface)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ flex: 1, paddingRight: '8px' }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                flexWrap: 'wrap',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '13px',
                                  fontWeight: 700,
                                  color: isSelected ? 'var(--red-primary)' : 'var(--wood-dark)',
                                }}
                              >
                                {b.name}
                              </span>
                              {isSelected && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    background: 'var(--red-primary)',
                                    color: '#fff',
                                    padding: '1px 6px',
                                    borderRadius: '6px',
                                    fontWeight: 700,
                                  }}
                                >
                                  Đang chọn
                                </span>
                              )}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--wood-dark)',
                                marginTop: '3px',
                                fontWeight: 600,
                              }}
                            >
                              📍 {b.mall}
                            </div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--wood-medium)',
                                marginTop: '2px',
                              }}
                            >
                              {b.address}
                            </div>
                            <div
                              style={{
                                fontSize: '10px',
                                color: '#047857',
                                marginTop: '3px',
                                fontWeight: 600,
                              }}
                            >
                              📞 {b.hotline} • ⏰ 09:30 - 22:00
                            </div>
                          </div>

                          <div
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              border: isSelected
                                ? '6px solid var(--red-primary)'
                                : '2px solid var(--wood-medium)',
                              background: '#fff',
                              flexShrink: 0,
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            });

            if (totalMatches === 0) {
              return (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '24px 10px',
                    color: 'var(--wood-medium)',
                    fontSize: '13px',
                  }}
                >
                  Không tìm thấy chi nhánh phù hợp với từ khóa "{branchSearchQuery}".
                </div>
              );
            }

            return cityBlocks;
          })()}
        </div>
      </div>
    </div>
  );
};
