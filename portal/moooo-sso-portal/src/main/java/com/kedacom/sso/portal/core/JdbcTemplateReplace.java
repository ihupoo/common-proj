package com.kedacom.sso.portal.core;


/**
 * jdbcTemplate重写 打印queryForObject中的异常信息
 * @author jiashunhe
 * @date 2018年11月14日
 */
@Deprecated
public class JdbcTemplateReplace {// extends JdbcTemplate

	// private Logger logger =
	// LoggerFactory.getLogger(JdbcTemplateReplace.class);

	// @Override
	// public <T> T queryForObject(String sql, RowMapper<T> rowMapper) throws
	// DataAccessException {
	// try {
	// List<T> results = query(sql, rowMapper);
	// return DataAccessUtils.requiredSingleResult(results);
	// } catch (DataAccessException e) {
	// logger.error(e.getMessage());
	// throw e;
	// }
	// }
	//
	// @Override
	// public <T> T queryForObject(String sql, Object[] args, int[] argTypes,
	// RowMapper<T> rowMapper)
	// throws DataAccessException {
	// try {
	// List<T> results = query(sql, args, argTypes, new
	// RowMapperResultSetExtractor<T>(rowMapper, 1));
	// return DataAccessUtils.requiredSingleResult(results);
	// } catch (DataAccessException e) {
	// logger.error(e.getMessage());
	// throw e;
	// }
	// }
	//
	// @Override
	// public <T> T queryForObject(String sql, Object[] args, RowMapper<T>
	// rowMapper) throws DataAccessException {
	// try {
	// List<T> results = query(sql, args, new
	// RowMapperResultSetExtractor<T>(rowMapper, 1));
	// return DataAccessUtils.requiredSingleResult(results);
	// } catch (DataAccessException e) {
	// logger.error(e.getMessage());
	// throw e;
	// }
	// }
	//
	// @Override
	// public <T> T queryForObject(String sql, RowMapper<T> rowMapper, Object...
	// args) throws DataAccessException {
	// try {
	// List<T> results = query(sql, args, new
	// RowMapperResultSetExtractor<T>(rowMapper, 1));
	// return DataAccessUtils.requiredSingleResult(results);
	// } catch (DataAccessException e) {
	// logger.error(e.getMessage());
	// throw e;
	// }
	// }

}

