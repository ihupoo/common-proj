package com.kedacom.sso.portal.service;

import com.kedacom.sso.portal.vo.CheckHolderCore;
import com.kedacom.sso.portal.vo.CheckHolderPlat;

public interface CheckCxfService {

	public CheckHolderCore getCheckHolderCore();
	
	public CheckHolderPlat getCheckHolderPlat();
	
	public String checkCore(CheckHolderCore checkHolderCore);
	
	public String checkPlat(CheckHolderPlat checkHolderPlat);
	
	
}
