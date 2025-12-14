'use client';

import { Bar, BarChart as RechartsBar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartProps {
    title: string;
    data: any[];
    dataKey: string;
    xAxisKey: string;
    yAxisLabel?: string;
    color?: string;
}

export default function BarChart({ title, data, dataKey, xAxisKey, yAxisLabel, color = '#3b82f6' }: BarChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <RechartsBar data={data}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis
                            dataKey={xAxisKey}
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                        />
                        <YAxis
                            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
                            className="text-xs"
                            tick={{ fill: 'currentColor' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(var(--card))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px',
                            }}
                        />
                        <Bar dataKey={dataKey} fill={color} radius={[8, 8, 0, 0]} />
                    </RechartsBar>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
