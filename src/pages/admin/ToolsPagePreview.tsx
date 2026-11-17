import React, { useMemo, useState } from 'react';
import type { ToolItem } from '../../services/toolsService';

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICES: Record<Device, { label: string; width: number; columns: number }> = {
    desktop: { label: 'Desktop', width: 1100, columns: 12 },
    tablet: { label: 'Tablet', width: 720, columns: 6 },
    mobile: { label: 'Mobile', width: 360, columns: 1 }
};

const CURRENT_ID = '__current__';

interface Props {
    /** Tools already saved (the one being edited is replaced by `draft`). */
    tools: ToolItem[];
    editingId: string | null;
    draft: Pick<ToolItem, 'html' | 'css' | 'spanDesktop' | 'spanTablet' | 'spanMobile' | 'order'>;
}

const clamp = (value: number, max: number) => Math.min(Math.max(Number(value) || 1, 1), max);

/** Mirrors the grid of /utils so the card being edited is seen among the others. */
export default function ToolsPagePreview({ tools, editingId, draft }: Props) {
    const [device, setDevice] = useState<Device>('desktop');
    const { columns, width } = DEVICES[device];

    const items = useMemo(() => {
        const others = tools.filter(t => t.id !== editingId);
        const all = [
            ...others.map(t => ({ ...t, isCurrent: false })),
            { id: CURRENT_ID, title: '', link: '', ...draft, isCurrent: true }
        ];
        // Stable sort: on equal order, the edited card goes after the saved ones.
        return all
            .map((item, idx) => ({ item, idx }))
            .sort((a, b) => (Number(a.item.order) || 0) - (Number(b.item.order) || 0) || a.idx - b.idx)
            .map(x => x.item);
    }, [tools, editingId, draft]);

    const spanFor = (item: { spanDesktop: number; spanTablet: number }) => {
        if (device === 'desktop') return clamp(item.spanDesktop, 12);
        if (device === 'tablet') return clamp(item.spanTablet, 6);
        return 1;
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                {(Object.keys(DEVICES) as Device[]).map(d => (
                    <button
                        key={d}
                        type="button"
                        onClick={() => setDevice(d)}
                        style={{
                            padding: '6px 14px',
                            borderRadius: 9999,
                            border: '1px solid rgba(255,255,255,0.15)',
                            background: device === d ? '#58a6ff' : 'transparent',
                            color: device === d ? '#0b0d12' : '#c9d1d9',
                            fontWeight: 600,
                            fontSize: 13,
                            cursor: 'pointer'
                        }}
                    >
                        {DEVICES[d].label}
                    </button>
                ))}
                <span style={{ color: '#8c93a0', fontSize: 12 }}>
                    {width}px · {columns} {columns === 1 ? 'coluna' : 'colunas'} · o card tracejado é o que você está editando
                </span>
            </div>

            <div style={{ background: '#000000', padding: 24, borderRadius: 8, overflowX: 'auto' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                        gridAutoRows: device === 'mobile' ? 'minmax(180px, auto)' : '240px',
                        gap: device === 'mobile' ? 16 : 20,
                        width,
                        margin: '0 auto'
                    }}
                >
                    {items.map(item => {
                        const cls = item.isCurrent ? 'wrapper-preview-admin' : `wrapper-preview-${item.id}`;
                        return (
                            <div
                                key={item.id}
                                style={{
                                    gridColumn: `span ${spanFor(item)}`,
                                    minWidth: 0,
                                    color: '#fff',
                                    position: 'relative',
                                    borderRadius: 28,
                                    outline: item.isCurrent ? '2px dashed #58a6ff' : 'none',
                                    outlineOffset: 4
                                } as React.CSSProperties}
                            >
                                <style>{`
                                    .${cls} {
                                        border-radius: 28px;
                                        height: 100%;
                                        width: 100%;
                                        overflow: hidden;
                                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                                    }
                                    ${item.css}
                                `}</style>
                                <div className={cls} dangerouslySetInnerHTML={{ __html: item.html }} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
