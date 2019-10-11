package com.kedacom.sso.portal.security.context;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.kedacom.movision.base.model.UserVO;





public class SessionUser implements UserDetails, com.kedacom.moooo.core.model.User, Serializable {

	private static final long serialVersionUID = 4750909576331758050L;

	private String token; // sso token
	private String username; // 用户名
	private String password;
	private String encryptionPassword;// sm4密码
	private UserVO user; // 用户信息
	private Boolean read = false; // 是否只读权限
	private List<GrantedAuthority> authorities; // 用户权限
	private Boolean isCurrentPlatForm;
	private String platformInfo; 	// ip地址
	private Boolean enableSUS = false;
	private Boolean isCurrentPlat4SSO;

	// 当前管理的用户域moid，用于AMC中标识集团管理员当前所管理的用户域
	private String currentManageUserDomainMoid;
	// 提示修改默认密码标识
	private Boolean modifyDefaultPassword = false;

	@Override
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO userVO) {
		this.user = userVO;
	}

	public void setAuthorities(List<GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	@Override
	public Collection<GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Override
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserMoid() {
		return user.getMoid();
	}

	public Boolean getRead() {
		return read;
	}

	public void setRead(Boolean read) {
		this.read = read;
	}

	public String getCurrentManageUserDomainMoid() {
		return currentManageUserDomainMoid;
	}

	public void setCurrentManageUserDomainMoid(String currentManageUserDomainMoid) {
		this.currentManageUserDomainMoid = currentManageUserDomainMoid;
	}

	public Boolean getModifyDefaultPassword() {
		return modifyDefaultPassword;
	}

	public void setModifyDefaultPassword(Boolean modifyDefaultPassword) {
		this.modifyDefaultPassword = modifyDefaultPassword;
	}
	
	public Boolean getIsCurrentPlatForm() {
		return isCurrentPlatForm;
	}

	public void setIsCurrentPlatForm(Boolean isCurrentPlatForm) {
		this.isCurrentPlatForm = isCurrentPlatForm;
	}

	public String getPlatformInfo() {
		return platformInfo;
	}

	public void setPlatformInfo(String platformInfo) {
		this.platformInfo = platformInfo;
	}

	public Boolean getEnableSUS() {
		return enableSUS;
	}

	public void setEnableSUS(Boolean enableSUS) {
		this.enableSUS = enableSUS;
	}

	public Boolean getIsCurrentPlat4SSO() {
		return isCurrentPlat4SSO;
	}

	public void setIsCurrentPlat4SSO(Boolean isCurrentPlat4SSO) {
		this.isCurrentPlat4SSO = isCurrentPlat4SSO;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Override
	public String getMoid() {
		return user == null ? null : user.getMoid();
	}

	@Override
	public String getName() {
		return user == null ? null : user.getName();
	}

	@Override
	public String getEmail() {
		return user == null ? null : user.getEmail();
	}

	@Override
	public String getE164() {
		return user == null ? null : user.getE164();
	}

	@Override
	public String getJid() {
		return user == null ? null : user.getJid();
	}

	@Override
	public String getCompanyMoid() {
		// return user == null ? null : user.getCompanyMoid();
		return null;
	}

	@Override
	public List<String> getRoleKey() {
		// return user == null ? null : user.getRoleKey();
		return null;
	}

	public String getEncryptionPassword() {
		return encryptionPassword;
	}

	public void setEncryptionPassword(String encryptionPassword) {
		this.encryptionPassword = encryptionPassword;
	}

}
