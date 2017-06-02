import { metaballs } from '../metaballs';
import { delimiters } from './delimiters';
import dropsFactory from './drops';
import labelsFactory from './labels';
import lineSeparatorFactory from './lineSeparator';
import { drawTopAxis, drawBottomAxis, boolOrReturnValue } from './xAxis';

export default (svg, dimensions, chartWidth, scales, configuration) => {
    const defs = svg.append('defs');

    defs
        .append('clipPath')
        .attr('id', 'drops-container-clipper')
        .append('rect')
        .attr('id', 'drops-container-rect')
        .attr('transform', `translate(5, 0)`)
        .attr('width', chartWidth + 10)
        .attr(
            'height',
            dimensions.height +
                configuration.margin.top +
                configuration.margin.bottom
        );

    const labelsContainer = svg
        .append('g')
        .classed('labels', true)
        .attr('transform', `translate(0, ${configuration.lineHeight})`);

    const chartContainer = svg
        .append('g')
        .attr('class', 'chart-wrapper')
        .attr(
            'transform',
            `translate(${configuration.labelsWidth + configuration.labelsRightMargin}, 55)`
        );

    // Place a transparent background rectangle at the back of the chart wrapper in order to catch mouse events.
    const chartBackground = chartContainer.append('rect')
         .attr('x', 0)
         .attr('y', configuration.margin.top)
         .attr('height', dimensions.height)
         .attr('width', chartWidth)
         .style('fill-opacity', '0.0');

    const dropsContainer = chartContainer
        .append('g')
        .classed('drops-container', true)
        .attr('transform', `translate(-10, 0)`)
        .attr('clip-path', 'url(#drops-container-clipper)')
        .style('filter', 'url(#metaballs)');

    chartContainer
        .append('g')
        .classed('extremum', true)
        .attr('width', chartWidth)
        .attr('height', 30)
        .attr('transform', `translate(0, -35)`);

    if (configuration.metaballs) {
        metaballs(defs);
    }

    const axesContainer = chartContainer.append('g').classed('axes', true);
    const lineSeparator = lineSeparatorFactory(
        scales,
        configuration,
        chartWidth,
        dimensions
    );
    const labels = labelsFactory(labelsContainer, scales, configuration);
    const drops = dropsFactory(dropsContainer, scales, configuration);

    return data => {
        lineSeparator(axesContainer, data);
        delimiters(svg, scales, configuration.dateFormat);
        drops(data);
        labels(data);
        if (boolOrReturnValue(configuration.hasTopAxis, data)) {
            drawTopAxis(axesContainer, scales.x, configuration, dimensions);
        }
        if (boolOrReturnValue(configuration.hasBottomAxis, data)) {
            drawBottomAxis(axesContainer, scales.x, configuration, dimensions);
        }
    };
};
