(defun org-babel-node-initiate-session (&optional session)
  "If there is not a current comit buffer in SESSION then create it.  Return the initialized session."
  (unless (string= session "none")
    (let ((session-buffer (get-buffer session)))
	  (if (org-babel-comint-buffer-livep session-buffer)
		session-buffer
		(save-window-excursion
		  (let ((new-buffer (make-comint-in-buffer session nil "node" nil "src/jrepl.js")))
			(switch-to-buffer new-buffer)
			(setq comint-process-echoes t)
			new-buffer))))))

(defun org-babel-prep-session:node (session params)
  "Prepare SESSION according to the header arguments specified in PARAMS."
  (org-babel-node-initiate-session session))

(defun org-babel-execute:node (body params)
  "Execute a block of Node Javascript code with org-babel.
   This function is called by `org-babel-execute-src-block'"
  (let ((org-babel-node-eoe-indicator "'ob-node'")
	(result-type (cdr (assoc :result-type params)))
	(full-body (org-babel-expand-body:generic
					body params ))
		(session (org-babel-prep-session:node
				  (cdr (assoc :session params)) params)))
	(mapcar (lambda (line)
			  (list (s-trim line)))
			(butlast (cdr
					  (org-babel-comint-with-output
						  (session org-babel-node-eoe-indicator t full-body)
						(insert ".break\n")
						(insert full-body)
						(insert "\n")
						(insert org-babel-node-eoe-indicator)
						(insert "\n")
						(comint-send-input nil t)))
					 2))))

(define-derived-mode node-mode js2-mode "Node")
