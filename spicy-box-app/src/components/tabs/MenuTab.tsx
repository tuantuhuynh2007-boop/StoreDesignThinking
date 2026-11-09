import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Calendar } from 'lucide-react';
import { SPICY_BOX_MENU, MENU_CATEGORIES } from '../../data/menuData';
import type { ActiveTab } from '../../types';

interface MenuTabProps {
  onNavigateTab: (tab: ActiveTab) => void;
}

export const MenuTab: React.FC<MenuTabProps> = ({ onNavigateTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return SPICY_BOX_MENU.filter(item => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const cleanSearch = searchQuery.toLowerCase().trim();
      const matchSearch =
        !cleanSearch ||
        item.name.toLowerCase().includes(cleanSearch) ||
        (item.koreanName && item.koreanName.toLowerCase().includes(cleanSearch)) ||
        item.desc.toLowerCase().includes(cleanSearch);
      return matchCategory && matchSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div style={{ paddingBottom: '24px' }}>
      {/* 1. Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4A2E1B 0%, #2A170C 100%)',
          color: '#fff',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 8px 24px rgba(42, 23, 12, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px' }}>🍲</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--gold-accent)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            Spicy Box Food Catalog
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0 6px 0' }}>
          DANH MỤC MÓN ĂN BUFFET
        </h2>
        <p style={{ fontSize: '12px', opacity: 0.85, lineHeight: 1.5, margin: 0 }}>
          Tìm kiếm ngay món ăn bạn thích để xem quầy buffet Spicy Box có phục vụ không nhé!
        </p>

        {/* Thanh tìm kiếm món */}
        <div
          style={{
            position: 'relative',
            marginTop: '14px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Search
            size={18}
            color="#9CA3AF"
            style={{ position: 'absolute', left: 14, pointerEvents: 'none' }}
          />
          <input
            type="text"
            placeholder="Tìm món: ba chỉ bò, phô mai, gà rán, chả cá, mì..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 40px 12px 42px',
              borderRadius: '9999px',
              border: 'none',
              fontSize: '13px',
              outline: 'none',
              background: '#fff',
              color: '#1F2937',
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
              boxSizing: 'border-box',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: 12,
                background: 'none',
                border: 'none',
                color: '#6B7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 4,
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* 2. Bộ lọc danh mục (Cuộn ngang) */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '8px',
          marginBottom: '14px',
          scrollbarWidth: 'none',
        }}
      >
        {MENU_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              style={{
                flexShrink: 0,
                padding: '8px 14px',
                borderRadius: '9999px',
                border: isSelected ? '1.5px solid var(--red-primary)' : '1px solid var(--wood-tint)',
                background: isSelected ? 'var(--red-primary)' : '#fff',
                color: isSelected ? '#fff' : 'var(--wood-dark)',
                fontSize: '12px',
                fontWeight: isSelected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.18s',
                boxShadow: isSelected ? '0 2px 8px rgba(197,34,31,0.25)' : 'none',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Thống kê số lượng món */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          fontSize: '12px',
          color: 'var(--wood-medium)',
        }}
      >
        <span>
          Đang hiển thị: <strong style={{ color: 'var(--wood-dark)' }}>{filteredItems.length}</strong> món
          {searchQuery ? ` cho từ khóa "${searchQuery}"` : ''}
        </span>
        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
          ✓ Luôn nạp đầy tại quầy
        </span>
      </div>

      {/* 4. Danh sách các món ăn (Grid) */}
      {filteredItems.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="card-box"
              style={{
                padding: '12px',
                display: 'flex',
                gap: '12px',
                alignItems: 'stretch',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                margin: 0,
              }}
            >
              {/* Ảnh món ăn */}
              <div
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  position: 'relative',
                  background: '#F3ECE5',
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  onError={e => {
                    // Fallback placeholder nếu mạng chậm
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
                  }}
                />
              </div>

              {/* Thông tin món */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                    {item.badge && (
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background:
                            item.badge === 'Best Seller ⭐'
                              ? '#FEE2E2'
                              : item.badge === 'Buffet Thả Ga'
                              ? '#DCFCE7'
                              : '#FEF3C7',
                          color:
                            item.badge === 'Best Seller ⭐'
                              ? '#DC2626'
                              : item.badge === 'Buffet Thả Ga'
                              ? '#16A34A'
                              : '#D97706',
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.highlight && (
                      <span style={{ fontSize: '9px', color: '#B45309', fontWeight: 600 }}>
                        ✨ {item.highlight}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--wood-dark)', margin: '2px 0 1px 0' }}>
                    {item.name}
                  </h3>
                  {item.koreanName && (
                    <div style={{ fontSize: '10px', color: 'var(--wood-medium)', fontStyle: 'italic', marginBottom: '4px' }}>
                      {item.koreanName}
                    </div>
                  )}
                  <p
                    style={{
                      fontSize: '11px',
                      color: '#4B5563',
                      lineHeight: 1.4,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '6px',
                    paddingTop: '6px',
                    borderTop: '1px dashed var(--wood-tint)',
                    fontSize: '10px',
                    color: '#059669',
                    fontWeight: 600,
                  }}
                >
                  <span>✓ Có sẵn trong buffet</span>
                  <span style={{ color: 'var(--red-primary)', cursor: 'pointer' }} onClick={() => onNavigateTab('booking')}>
                    Đặt bàn ăn ngay ➔
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="card-box"
          style={{
            textAlign: 'center',
            padding: '36px 20px',
            color: 'var(--wood-medium)',
          }}
        >
          <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔍</div>
          <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--wood-dark)', marginBottom: '4px' }}>
            Không tìm thấy món "{searchQuery}"
          </h4>
          <p style={{ fontSize: '12px', maxWidth: '320px', margin: '0 auto 16px auto', lineHeight: 1.5 }}>
            Hãy thử tìm bằng từ khóa khác (ví dụ: bò, gà rán, chả cá, phô mai) hoặc khám phá toàn bộ quầy line buffet nhé!
          </p>
          <button
            className="btn-pill btn-gold"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            style={{ width: 'auto', padding: '8px 20px', fontSize: '12px' }}
          >
            Xem lại tất cả món ăn
          </button>
        </div>
      )}

      {/* 5. Sticky Call to Action Footer */}
      <div
        style={{
          marginTop: '20px',
          background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
          border: '1.5px solid #FDBA74',
          borderRadius: '18px',
          padding: '16px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '4px' }}>
          <Sparkles size={16} color="#EA580C" />
          <strong style={{ fontSize: '14px', color: '#9A3412' }}>
            Đã tìm thấy món ăn yêu thích của bạn?
          </strong>
        </div>
        <p style={{ fontSize: '12px', color: '#C2410C', margin: '0 0 12px 0' }}>
          Chỉ từ <strong>139.000đ</strong>/người để thỏa thích thưởng thức toàn bộ menu Tokpokki & món chiên không giới hạn!
        </p>
        <button
          className="btn-pill btn-red"
          onClick={() => onNavigateTab('booking')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            maxWidth: '320px',
            margin: '0 auto',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          <Calendar size={16} /> Đặt bàn Spicy Box ngay ➔
        </button>
      </div>
    </div>
  );
};
