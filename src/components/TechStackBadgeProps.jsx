import SafeDynamicSvgIcon from './SafeDynamicSvgIcon';

const TechStackBadge = ({ name, icon, level, darkMode = true }) => {
  const getLevelColor = (level) => {
    if (level >= 80) return darkMode ? 'text-green-400' : 'text-green-600';
    if (level >= 60) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    if (level >= 40) return darkMode ? 'text-orange-400' : 'text-orange-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  return (
    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800/50 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors group border border-gray-300 dark:border-gray-700">
      {icon && <SafeDynamicSvgIcon svgString={icon} className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <span className="font-medium truncate text-gray-800 dark:text-gray-200">{name}</span>
          <span className={`text-xs font-semibold ${getLevelColor(level)}`}>
            {level}%
          </span>
        </div>
        <div className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{ width: `${level}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default TechStackBadge;